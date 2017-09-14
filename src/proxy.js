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
var agent_ssh = require('redrouter.agent.http');
var agent_xterm = require('redrouter.agent.xterm');
var agent_xterm = require('redrouter.agent.http');
var resolver_ssh = require('redrouter.resolver.ssh');
var middleware_docker = require('redrouter.middleware.docker');

/*
  Define a RedRouter Instance
*/

var proxy = new redrouter({
  backend : {
    constructor: backend_etcd,
    options: {
        etcd_hosts : options.etcd_conf.etcd_hosts,
        etcd_conn_opts : {
          key : fs.readFileSync(options.etcd_conf.etcd_conn_opts.key),
          cert : fs.readFileSync(options.etcd_conf.etcd_conn_opts.cert),
          ca : fs.readFileSync(options.etcd_conf.etcd_conn_opts.ca)
        }
    }
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
        docker_args : {
          protocol: options.docker_conf.docker_args.protocol,
          host: options.docker_conf.docker_args.host,
          port: options.docker_conf.docker_args.port,
          key : fs.readFileSync(options.docker_conf.docker_args.key),
          cert : fs.readFileSync(options.docker_conf.docker_args.cert),
          ca : fs.readFileSync(options.docker_conf.docker_args.ca)
        }
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
      options: {
        host: options.ssh_conf.host,
        port: options.ssh_conf.port,
        key: fs.readFileSync(options.ssh_conf.key)
      }
    },
    {
      constructor: agent_http,
      options: {
        host: 'localhost',
        port: 3000
      }
    }
  ]
});
