'use strict';

/*
 * File loader service to load file from a GitHub repo via GitHub API
 */
SwaggerEditor.service('GitHubFileLoader',
  function GitHubFileLoader($http, defaults, FileLoader) {

    function loadFromGitHub(pathToFile, branch) {

      var modifiedPath = insertContentsSegmentIntoPath(pathToFile);
      var fullUrl = 'https://github.intuit.com/api/v3/repos/' + modifiedPath;

      if (branch) {
        fullUrl += '?ref=' + branch;
      }

      return $http({
        method: 'GET',
        url: fullUrl,
        headers: {
          accept: 'application/json',
          authorization: 'token ' + defaults.githubOauthToken
        }
      }).then(function (resp) {

        var base64Content = resp.data.content;
        var decodedContent = atob(base64Content);

        if (angular.isObject(decodedContent)) {
          return jsyaml.dump(decodedContent);
        } else {
          return FileLoader.load(decodedContent);
        }
      });
    }

    function insertContentsSegmentIntoPath(path) {
      var split = path.split('/');

      var result = split[0] + '/' + split[1] + '/contents';

      for (var i = 2; i < split.length; i++) {
        result += '/' + split[i];
      }

      return result;

    }

    this.loadFromGitHub = loadFromGitHub;
  });
