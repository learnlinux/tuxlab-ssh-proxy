/**
  SSH Tunnel Example using RedRouter
**/

// Imports
var fs = require('fs');

// Import RedRouter Core
var redrouter = require('redrouter').create;
var options = JSON.parse(fs.readFileSync('/root/settings.json'));

// Import RedRouter Components
var backend_etcd = require('redrouter.backend.etcd');
var agent_ssh = require('redrouter.agent.ssh-proxy');
var agent_wetty = require('redrouter.agent.wetty');
var resolver_ssh = require('redrouter.resolver.ssh');
var middleware_docker = require('redrouter.middleware.docker');

/*
  Define a RedRouter Instance
*/

var _docker_args = options.docker_conf.docker_args

if (_docker_args.cert != undefined) { _docker_args.cert = fs.readFileSync(options.docker_conf.docker_args.cert); }
if (_docker_args.key != undefined) { _docker_args.key = fs.readFileSync(options.docker_conf.docker_args.key); }
if (_docker_args.cacert != undefined) { _docker_args.cacert = fs.readFileSync(options.docker_conf.docker_args.cacert); }

var proxy = new redrouter({
  ssl : {
    key : fs.readFileSync('/root/host.pem'),
    cert : fs.readFileSync('/root/cert.pem')
  },
  backend : {
    constructor: backend_etcd,
    options: options.etcd_conf
  },
  resolvers: [
    { constructor: resolver_ssh,
      options: {
        defaults: {
          allowed_auth: ['password']
        }
      }
    }
  ],
  middleware: [
    { constructor: middleware_docker,
      options: {
        docker_url : options.docker_conf.docker_url,
        docker_args : _docker_args
      }
    }
  ],
  agents: [
    {
      constructor: agent_wetty,
      options: options.wetty_conf
    },
    { constructor: agent_ssh,
      options: options.ssh_conf
    }
  ]
});
