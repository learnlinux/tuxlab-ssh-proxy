/**
  SSH Tunnel Example using RedRouter
**/

// Imports
var fs = require('fs');

// Import RedRouter Core
var redrouter = require('redrouter').create;
var options = JSON.parse(fs.readFileSync('/usr/lib/tuxlab/settings.json'));

// Import RedRouter Components
var backend_etcd = require('redrouter.backend.etcd');
var agent_ssh = require('redrouter.agent.ssh');
var agent_xterm = require('redrouter.agent.xterm');
var resolver_ssh = require('redrouter.resolver.ssh');
var middleware_docker = require('redrouter.middleware.docker');

/*
  Define a RedRouter Instance
*/

var proxy = new redrouter({
  backend : {
    constructor: backend_etcd,
    options: options.etcd_conf
  },
  resolvers: [
    {
      constructor: resolver_ssh,
      options: {
        defaults: {
          allowed_auth: ['password']
        }
      }
    }
  ],
  middleware: [
    {
      constructor: middleware_docker,
      options: {
        docker_url : options.docker_conf.docker_url,
        docker_args : _docker_args
      }
    }
  ],
  agents: [
    {
      constructor: agent_xterm,
      options: options.xterm_conf
    },
    {
      constructor: agent_ssh,
      options: options.ssh_conf
    }
  ]
});
