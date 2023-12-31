import { build } from 'electron-builder';

build({
  config: {
    productName: 'Work tool',
    artifactName: '${productName}-${version}-${platform}-${arch}.${ext}',
    files: ['dist/**/*', '!node_modules'],
    includeSubNodeModules: true,
    directories: {
      output: 'release',
      buildResources: 'assets',
    },
    win: {
      target: ['nsis'],
      icon: 'assets/icon.ico',
    },
    nsis: {
      artifactName: '${productName}-${version}-installer.${ext}',
      installerIcon: 'assets/installer.ico',
    },
    mac: {
      identity: null,
      target: ['default'],
      icon: 'assets/icon.icns',
    },
  },
});
