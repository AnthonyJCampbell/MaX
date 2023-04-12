# Builds

This article provides information on how our builds process works. The builds process should rarely need to be changed, so this is mostly for understanding what happens currently rather than how to extend it.

## Summary

There are 3 key parts to the build process, in this order:

- Webpack's compilation/bundling/minification `webpack`. We configure this with the `webpack.*.js` files.
- Create-react-app's `react-scripts build`. This works out of the box
- Electron's `electron-builder`. This works out of the box with one tweak

There are 2 key folders that play a part in the build process:

- `build/` contains transpiled/compiled minified code
- `dist/` contains executables/installers etc for distributing the code in `build/`

## Build process

- The [**Webpack bundler**](https://webpack.js.org/) script `webpack` runs over `node-server/`. This does a few things under the covers:
  1. Transpiles TypeScript code into JavaScript code
  2. Bundles and moves pre-existing and newly-transpiled JavaScript code into `build/node-server/node-server.js`, which is minified
- The **Create React App build** script `react-scripts build` runs. This does lots of things under the covers, the key parts are:
  1. Copies the contents of `public/` into `build/` with no changes
  2. Transpiles/bundles/packs etc all the code (both TypeScript and JavaScript) in `src/`. Lots of magic happens here, but we don't need to worry about it.
  3. Copies the minified result of the above into `build/static/js`
- The **Electron builder** script `electron-builder` runs over the `build/` directory. This bundles the code into installable/executable packages in `dist/`. We provide it a flag to let it know which `.js` file it should launch first. In our case this is `build/node-server/node-server.js`, i.e. the bundled and minified version of our `node-server` code.

## Troubleshooting

### Local build issue

#### ENOTSUP - Unsupported engine for electron-ui

To ensure that we consistently write our `package-lock.json` file and don't include commits with spurious changes we enforce exact versions of `npm` and `node` through engine configuration in `package.json`. This error indicates that the version of NPM installed does not match that expected.

Make sure you have installed Node at exactly v14.17.3 from https://nodejs.org/dist/v14.17.3/

#### Unexpected changes to `package-lock.json`

We expect developers to understand all changes they check into the codebase, and `package-lock.json` is no exception! Unexpected changes to `package-lock.json` will often need to be understood. This section includes some possible resolutions.

1. Use `npm ci` instead of `npm install` if you want to install _exactly_ what is in the `package-lock`
2. Check that you are connected to the VPN if Artifactory URLs are being replaced by public NPM registries
3. Almost all changes could be caused by stale cache data stored by NPM

The following sequence will blow away cached data that NPM may have that is stale (e.g. if you were previously disconnected to the VPN and have since reconnected).

```ps1
# Bring back the package-lock to last-known good state.
git checkout HEAD -- package-lock.json

# Clear any already pulled packages (Windows Powershell example given - but anything that deletes `node_modules` works).
Remove-Item -Recurse -Force .\node_modules

# Clear NPM's cache
npm cache clear --force
```

### Pipeline failures

#### electron_fvs

- Failing with `"Something is already running on port 3001"` - This is caused by the React process getting stuck on the Windows build V. Restarting the VM is the easiest fix:
  - Log onto the VM from Remote Desktop Connection with `Computer: maxucbuild`, `Username: dcl\accessionbuild` and password listed for `accwinrunrefresh` in [this metacom article](https://metacom2.metaswitch.com/confluence/x/UF4KAg).
  - Restart it as you would a normal Windows machine, don't worry about providing a reason when prompted.
