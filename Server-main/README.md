# Express JS Server Template

This is a template repository that for Express JS application. 

The template only deals with :
- Development environment
- Developemnt server
- Local builds
- Docker image build
- Code bundling

Any other feature required by the developer or the team using this template should make necessary changes, as per the requirement.

## Dev Containers

This repository supports the use of Dev Containers. To have a uniform development environment and to avoid cluttering the local system, we have chosen to use Dev Container.

IDEs like [VS Code](https://code.visualstudio.com/) and [IntelliJ IDEA](https://www.jetbrains.com/idea/) support Dev Containers via the use of [extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) developed by Microsoft. Install the extension locally to start the use of Dev Containers.

More information about Dev Containers and it's specifications can be found [here](https://containers.dev/).


## Rollup

This repository uses Rollup as it's module bundler. 

This helps us in:
- Generating a single build file.
- Plugin driven configuration.
- Support for transpiling Typescript code to Javascript.
- Tree shaking.
- Can be extended to support other files like HTML, CSS, JSON and others

More about Rollup can be found [here](https://rollupjs.org/).

## Docker

This repository uses Docker as it's deployment strategy to have consistent builds and deployment in production. Node JS versions in Dev Containers and Dockerfile match, keeping the development and production environments same.

Image build scripts are included in [package.json](./package.json) and users can change it accordingly.

### Adding environment variables

#### Build time environment variables.
Build time environment can be added by mentioning it as arguments in [docker build](https://docs.docker.com/reference/cli/docker/image/build/) command.

Example
```bash
docker build [path] -t --build-arg <KEY>=<VALUE> --build-arg <KEY>=<VALUE> -t [tag] 
```

The same Key-Value pair can be used inside the docker file (build time only) using

```Dockerfile
ARG KEY
ENV KEY=$KEY
```

#### Runtime environment variables

Environment variables like database secrets, API keys and others can be passed to the docker container by passing them as arguments in [docker run](https://docs.docker.com/reference/cli/docker/container/run/) command.

Example

```bash
docker run -p <PORT>:<PORT> --env <KEY>=<VALUE> --env <KEY>=<VALUE> [image_tag]
```

Environment variables can also be passed using .env file.

```bash
docker run -p <PORT>:<PORT> --env-file [./relative/path/to/.env] [image_tag]
```

This repository already has a __.env__ file but is ignored by Git to make sure that environment variable values used in production are not exposed in the repository. A __.env.example__ file is present in the repository to give users a view of all the environment variables used in the application. 

It is to be noted that the __.env__ file is only used in production and developers should add, remove, or update development environment variables in __.devcontainer/devconainer.json__ file. 

Make sure to update the .env.example file once you have added or removed an environment variable at __.devcontainer/devconainer.json__ .

## Usage

We recommend developers to fork this repository and develop necessary services that require __NodeJS/ExpressJS__ .

Make sure to keep your main branch in sync with the main branch of this repository to keep up with updates related to settings and features that are good to have in a Node JS repository.