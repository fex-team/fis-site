fis.config.set('roadmap.path', [{
    reg: "**.html",
    useDomain: true
}]);

fis.config.set('roadmap.domain', 'http://fex-team.github.io/fis-site');
fis.config.set('modules.postpackager', 'simple');
fis.config.set('modules.optimizer.html', 'html-minifier');
fis.config.set('settings.postpackager.simple.autoCo zbine', true);
fis.config.set('settings.optimizer.html-minifier', {
    minifyJS: true
});
