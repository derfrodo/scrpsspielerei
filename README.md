# Some screeps experiments :)

# Workaround for uploading main.js:
There is an issue uploading the correct file extension to screeps in version 1.3.0... therefore we changed the screeps webpack plugin version from:

"screeps-webpack-plugin": "^1.3.0",
to
"screeps-webpack-plugin": "git://github.com/langri-sha/screeps-webpack-plugin.git"

inside the package.json
// workaround from: https://github.com/screepers/screeps-typescript-starter/issues/62