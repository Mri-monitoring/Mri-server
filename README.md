Mri-Server
=========

> Neural network monitoring

This project is based on Reportr, the open source dashboard. For instructions specific to Reportr, please [see the project homepage](https://github.com/Reportr/dashboard).

Mri-server constitutes the web-based monitoring portion of Mri. When used together with the [Mri-app for Caffe](https://github.com/Mri-monitoring/Mri-app) or the [Mri-python-client](https://github.com/Mri-monitoring/Mri-python-client), it allows you to watch the progress of your networks as they train from anywhere, as well as test multiple hyperparameters or architectures at once.

The project is entirely open source and you can host your own Mri-server instance on your own server or Heroku. 

[![Screen Preview](./preview.png)](./preview.png)

## Installation

For installation instructions, see the [documentation](http://mri.readthedocs.org/)

## Configuration

Reportr is configured using environment variables. 

| Name | Description |
| ---- | ----------- |
| PORT | Port for running the application, default is 5000 |
| MONGODB_URL | Url for the mongoDB database |
| REDIS_URL | (Optional) Url for a redis database when using worker mode |
| AUTH_USERNAME | Username for authentication |
| AUTH_PASSWORD | Password for authentication |

## Running with Mri-app or Mri-python-client
The Mri clients already know how to talk to the server, and will automatically create reports and visualizations as you train networks. Simply modify the Mri-app configuration file to properly interface with the server as a dispatch. See [API_REFERENCE.md](https://github.com/Mri-monitoring/Mri-server/blob/master/API_REFERENCE.md) for full API specifications.

## Scale it

Reportr can easily be scaled on Heroku (and compatibles), use the `REDIS_URL` to enable a task queue between **workers** and **web** processes.
