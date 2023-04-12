## Gitlab CI builds

When a change is pushed to any branch it is automatically built on Gitlab CI and can be tracked [here](https://git.datcon.co.uk/accession/Desktop/ad-ui-refresh/pipelines). This will produce and archive a Windows and Mac installer.

The installer can be published to [artifactory](https://artifactory.metaswitch.com/webapp/#/artifacts/browse/tree/General/accession-clients/Desktop/ADUIR) by manually running the `publish_installers` job on a pipeline containing a successful build.

### Infrastructure

The GitlabCI builds mostly happen in a Linux based docker container (exceptions are documented below).  This container is built from a base [electronbuild container](https://git.datcon.co.uk/accession/Desktop/desktop-build-container). It can be found on [artifactory](https://artifactory.metaswitch.com/webapp/#/artifacts/browse/tree/General/docker-virtual/max-client-containers/desktop).

For more general info on artifactory, see [here](https://metacom2.metaswitch.com/confluence/display/CrossProduct/Artifactory).

#### MacOS runners

The `build_ui_mac` job has to be run on a mac. We have gitlab runners on our mac build machines for this purpose - you can see them in the `Settings->CI/CD->Runners` section of the repository settings.

Gitlab CI knows to run the mac jobs on this runner because the `build_ui_mac` job has a `tags:` parameter specifying the tags that the runners must match. The corresponding mac runners have a matching set of tags (shown in the settings UI above), so get selected to run the mac jobs.

##### MacOS runner setup

Firstly, ensure the [common setup](https://metacom2.metaswitch.com/confluence/x/dsB9Bg) for MaX UC Desktop mac build machines and runners is complete.

Then, to allow the runner to build the electron UI:
- Install the [latest LTS node.js](https://nodejs.org/en/download/) on the mac
- Add the tag `npm_installed` to the runner
    - In the AccessionDesktop repository, in `Settings->CI/CD->Runners`, find the runner, click `Edit`, and add the tag
    - Ensure the `Locked` checkbox is unticked (this allows us to add it to this repo)
- Enable the runner for this project
    - In this repository, go to `Settings->CI/CD->Runners`. Find the runner under the `Available specific runners` section and click `Enable for this project`

#### Windows runners

We re-use our Windows runners for the `electron_fv` job, because it must be run on an OS that has a graphical interface for emulating user input.

##### Windows runner setup

- Install the 64-bit LTS version of [Node.js](https://nodejs.org/en/download/) on the build machine.
- Add the tags `refresh` and `windows` to the runner.

