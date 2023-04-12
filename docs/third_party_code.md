# Third party code

This document covers processes for handling 3rd party code.

## Background

Some terminology first:

- **Manifest**: [Manifests](https://metacom2.metaswitch.com/confluence/x/v6SEAw) are YAML files that define an artifact (e.g. the electron-ui) at a specific version, and all their immediate dependencies.

- **License**: We use licenses to determine whether we can use specific pieces of Free and Open Source Software (FOSS). See [this metacom article on licenses](https://metacom2.metaswitch.com/confluence/x/IustAg) for more general information

### What do we need to do?

There are three broad sections

1. When we want to use third party packages we need to ensure they have a license type that allows us to.
   We use the [NPM license-checker](https://www.npmjs.com/package/license-checker) for this.

2. We need to generate a manifest for our codebase each release. This will reference manifests for its dependencies.
   We use [qs-manifest](https://git.datcon.co.uk/tools.core/qs-manifest/) for this.

3. We need to generate manifests for all of our codebase's dependencies (if they don't already exist in Artifactory)
   Again we use [qs-manifest](https://git.datcon.co.uk/tools.core/qs-manifest/) for this, but there's also manual work involved.

### How does license checking and manifest generation work at a high level?

- The information about the package is taken from the package-lock.json which includes the version and the name of the package. These are used to search npmjs.com, from where the licensing information is extracted.

- If the license information in npmjs.com is for some reason unclear / non-existent / not outlined properly, the manifest generation should be done manually. Manually generated manifests **must** be reviewed by the component owner for third-party code.

## What should I do when I add a 3rd party package?

Follow these steps whenever you add a new package

1. **Install the package**

   - If your package will be used by the app as it's running, run `npx link-module-alias clean; npm install <package_name> --save; npx link-module-alias`
   - If it will only be used internally (e.g. for testing or building) run `npx link-module-alias clean; npm install <package_name> --save-dev; npx link-module-alias`

2. **Push your changes.** Finish writing the rest of your code, then push. The `build-npm-manifest` pipeline job will create a manifest for `electron-ui` incorporating your new package.

3. **Check that the `deep-validate-manifest` job passes.** This verifies the manifest created in step 2 is valid. It's in the `dependency_check` stage and takes 2 or 3 minutes. Note that for the job to pass, it is expected that it shows the line "ERROR: No files to upload" - this indicates that no file needed to be generated to hold any invalid data that was found, and thus absence of this information indicates success.

   - It passes - Great, no new external manifests need to be added. You're done and can skip the remaining steps
   - It fails - Move to step 4.

4. **If the validation has failed:**

   - Browse the `deep-validate-manifest` artifacts and download `invalid-manifests.yaml`. This will list the validation errors.
   - If the job failed because an external manifest couldn't be found in Artifactory - Go to step 5.
   - Otherwise there's an error in the manifest producing code. Raise it with team refreshers.

5. **If there are missing external manifests**, you need to create them
   a. Manually run the `generate_external_manifests` job in the `build` stage of your pipeline. This will generate manifests for the missing depedencies on a best effort basis, it takes ~5 minutes.
   b. Download the artifacts created by that job
   c. Unzip and manually check the generated dependencies in target/manifests/external for correctness. See [verifying an external manifest](#verifying-an-external-manifest) below. Fix any that aren't correct.
   d. If the job says `WARNING! Failed to create manifests for the following X dependencies:` near the bottom of its output, you'll need to manually create manifests for those dependencies as well. See [creating-an-external-manifest](#creating-an-external-manifest) for how to do this. Add the manually created manifests to the directory containing the downloaded manifests.

   Once you've completed the above steps you should have a directory full of correct manifests. Move to step 6, uploading them.

6. **Upload manifests to Artifactory**. For this step you will need docker installed. If you're running Linux you probably already have it otherwise look into setting up [Docker for Windows](https://docs.docker.com/docker-for-windows/install/) or [Docker for Mac](https://docs.docker.com/docker-for-mac/install).
   a. Ensure you have an artifactory API token. See the "Credentials for pushing packages" section of [this metacom article](https://metacom2.metaswitch.com/confluence/x/3F32AQ) for how to get one.
   b. Pull the latest `qs-manifest` container. You can find the latest version as `version = ...` under `[package]` in `qs-manifest`'s [Cargo.toml](https://git.datcon.co.uk/tools.core/qs-manifest/-/blob/master/Cargo.toml#L6).

   ```bash
   docker pull art-docker.metaswitch.com/tools.core/qs-manifest:<VERSION>
   ```

   c. Run the following command, substituting your initials, token, absolute path to your directory of manifests and the qs-manifest version

   ```bash
    docker run --volume /ABSOLUTE/PATH/TO/MANIFESTS:/home/manifests art-docker.metaswitch.com/tools.core/qs-manifest:<VERSION> /bin/bash -c "export ART_CI_USER=<LOWERCASE INITIALS>; export ART_CI_TOKEN=<ARTIFACTORY TOKEN>; qs-manifest push /home/manifests/*.yaml"
   ```

   It's possible a manifest will fail validation. If so, none of them will be uploaded. Manually fix it (see [verifying an external manifest](#verifying-an-external-manifest) for common problems) then try again.
   d. Once the manifests are uploaded, retry the pipeline job that failed in step 3.

# Manifests

## Verifying an external manifest

We autogenerate manifests for our dependencies. Unfortunately this is only ~90% reliable, meaning they all need to be manually verified. This section details how to do so.

The manifest should have a name like this
`workbox-routing~javascript-lib~v4.3.1.yaml`

The contents of the manifest should look like this:

```yaml
schema_version: 2 # Should always be 2
name: |- # Package name
  workbox-routing
semver: 4.3.1 # Package version
type: javascript-lib # Should always be javascript-lib
external:
  upstream: https://github.com/googlechrome/workbox # Package's github repo
  license_raw: MIT # All licenses the package is available under
  license_text: "Copyright 2018 ..." # Contents of the license
  license_file: LICENSE # File in which the license is found (often LICENSE or README.md)
  license: MIT # The license we are taking the package under
```

Verify the following:

1. Any `/`s in the manifest's name have been replaced with `%2F` in the filename
2. The `upstream:` field contains just a URL
3. The `license_text` doesn't contain chunks of README. This will be ~95% of the issues you come across.
4. The `license_text` is the correct text for the license type listed under `license_raw` and `license`
5. If `license` contains multiple licenses (e.g. `(MIT OR ISC)`) then the most permissive should be selected ([guidance available on Metacom](https://metacom2.metaswitch.com/confluence/x/IustAg))

Important note: If for some reason you need to check the package's source code by navigating to the Github URL you must remember to **select the tag matching the version of the package in the manifest**. License information can change between releases of a package - we must make sure we're always getting information for the correct version.

![How to select the correct tag of a package's codebase](/docs/images/selecting-correct-github-tag-for-manifests.jpg)

## Creating an external manifest

Creating an external manifest is a bit tedious but not too hard. All manually created manifests **must** be reviewed by the component owner for third party code before thye are uploaded, as getting the fields right can be tricky.

1. Make a file called `<package-name>~javascript-lib~v<version>.yaml`
2. Copy paste the example manifest above
3. Edit the fields to be correct for your package

## Open source acknowledgements (OSAs)

> WARNING: The OSA process doesn't currently work, see https://jira.metaswitch.com/browse/DUIR-4651

We can generate OSAs by

- feeding the electron-ui manifest to the `qs-open-source-acks` command to produce an XML file in DITA format (the `form_open_source_acks` job)
- customizing the DITA file to supply concrete values for the variable placeholders
- feeding the customized DITA file to the dita tool, to produce an HTML5 version of the data (the `os_acks_html` job).

Both CI jobs are manual, and the resultant HTML is found as an artifact of the `os_acks_html` job.

There may be some errors around unknown license types that only occur for OSA, this is okay as the end result still seems fine. It's tracked in a [Quicksilver issue](https://jira.metaswitch.com/browse/QSBUGS-183).

At the moment, as a further manual action, we take that HTML5 output, and append it to the Java HTML licence acknowledgement in
`combined.licences` in the AccessionDesktop repository.

These CI jobs need to be separate since they use different base docker images to provide the necessary tools.
Due to a bug in gitlab, the dependency between the jobs is expressed using `dependencies` rather than the `needs` used in the rest of the CI yaml.

```bash
qs-open-source-acks *electron-ui*.yaml
```

This will create a "DITA XML Open Source Acknowledgement document".

We aren't yet sure when we'll want to do this, but it'll probably be something like "tagged builds". As such there is no process in place yet, but it could be e.g. added to our pipelines as a job that triggers on a tagged build (probably via adding it to `qs-ci`).

# Future

## Proper categorisation of packages

Packages should, in theory, be split into three categories depending on what they're used for. [DUIR-1484](https://jira.metaswitch.com/browse/DUIR-1484) deals with this, more info about how and why package handling should be done this way can be found there.
