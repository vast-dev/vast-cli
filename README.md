# Vast

Vast is a framework for building RESTful backends using nothing but JSON files to define the endpoints, schemas and even the logic. This opens up interesting possibilities for developer user interfaces, as apps no longer need to be built in an IDE. UIs for controlling the JSON could take any form and be optimized for specific use cases, industries or tasks. 

Imagine building an entire backend API via a mobile app, in a few minutes...

...or working in realtime with a team of 5 in a virtual reality environment where apps, endpoints and tables take on 3D forms...

The possibilities are V A S T.


## Packages  
Vast is made up of several packages spread across different repositories.

| Package | Description        |
|---------|--------------------|
| [Core](https://github.com/vast-dev/vast) | Contains all the logic for processing JSON files and calling the corresponding schematics. |
| [Meta Schematics](https://github.com/vast-dev/vast-cli) | An Angular Schematic library used to generate Vast JSON files |
| [Vast CLI](https://github.com/vast-dev/vast-cli) | A CLI tool for generating Vast projects and compiling them to Typescript |

## Getting Started

Install the Vast CLI and create a new Vast project:

```
$ npm i -g @vast/cli
$ vast new project-name
```

## JSON Files

### Project & Applications

The default `vast.json` file in the root of your repo defines a Project, which can have multiple applications inside.

```json
{
  "name": "my-project",
  "apps": {
    "task-manager": {
      "name": "Task Manager",
      "description": "A headless task management system using RESTful APIs"
    }
  }
}
```

### Schemas

Reusable schemas can be defined inside the file `apps/task-manager/schemas.json`.

```json
{
  "schemas": {
    "TaskDto": {
      "type": "object",
      "required": ["name"],
      "properties": {
        "name": { "type": "string", "example": "My first task" },
        "ownerId": {
          "type": "integer",
          "format": "int64",
          "example": 10
        },
        "done": { "type": "boolean", "example": false, "default": false }
      }
    },
    "Task": {
      "type": "object",
      "required": ["name"],
      "properties": {
        "id": {
          "type": "integer",
          "format": "int64",
          "example": 10
        },
        "name": { "type": "string", "example": "My first task" },
        "owner": { "$ref": "#/schemas/User" },
        "done": { "type": "boolean", "example": false, "default": false }
      }
    },
    "User": {
      "type": "object",
      "required": ["name", "email"],
      "properties": {
        "id": {
          "type": "integer",
          "format": "int64",
          "example": 10
        },
        "name": { "type": "string", "example": "Fred Smith" },
        "email": { "type": "string", "example": "fred@vastscript.com" }
      }
    }
  }
}
```

### Endpoints

You can create endpoints using an extended version of Open API formatted JSON inside `apps/task-manager/endpoints.json`. You can reference schemas defined in `schemas.json`.
Any path params are available to the endpoint's steps as "params" (TBC). The body can be accessed with "body".

```json
{
  "endpoints": {
    "openapi": "3.0.3",
    "paths": {
      "/task": {
        "post": {
          "summary": "Create a new task",
          "operationId": "createTask",
          "requestBody": {
            "description": "Create a new task",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/schemas/TaskDto"
                }
              }
            },
            "required": true
          },
          "responses": {
            "200": {
              "description": "Task created successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/schemas/Task"
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

### Functions

The file `apps/task-manager/functions.json` is where you can define reusable logic for your app.

```json
{
  "functions": {
    "createTask": {
      "arguments": {
        "task": {
          "$ref": "#/schemas/TaskDto"
        }
      },
      "returns": {
        "$ref": "#/schemas/Task"
      },
      "variables": {},
      "start": {
        "$ref": "#/functions/createTask/steps/writeLog"
      },
      "steps": {
        "writeLog": {
          "type": "log",
          "next": {
            "$ref": "#/functions/createTask/steps/createTask"
          },
          "arguments": {
            "message": "Creating new task"
          }
        },
        "createTask": {
          "type": "dbCreate",
          "next": {
            "$ref": "#/functions/createTask/steps/end"
          },
          "arguments": {
            "table": "task",
            "data": {
              "name": "task.name",
              "done": "task.done"
            }
          }
        },
        "end": {
          "type": "end",
          "arguments": {}
        }
      }
    }
  }
}
```

### Data tables

```json
{
  "tables": {
    "Task": {
      "required": ["id", "name", "done"],
      "properties": {
        "id": {
          "type": "number",
          "primary": true
        },
        "name": { "type": "string" },
        "owner": { "$ref": "#/schemas/User" },
        "done": { "type": "boolean", "default": false }
      }
    },
    "User": {
      "required": ["name"],
      "properties": {
        "id": {
          "type": "number",
          "primary": true
        },
        "name": { "type": "string" },
        "owner": { "$ref": "#/schemas/User", "nullable": true },
        "done": { "type": "boolean", "default": false }
      }
    }
  }
}
```

### Roles & permissions

TBC

## Defining Steps

Steps are pieces of logic that get compiled to lines of code. They can be used in either Endpoints or Functions.
Think of steps like branches of a tree. Every function starts with a single branch, but can be split by certain types of steps like If statements, Loops or Switches.

Steps can have their own outputs and these outputs can be referenced in any branches stemming from the step.

## FAQ

### Why a single file for all endpoints/functions/etc instead of separate files?

Separate files give more granular control over concurrent edits (in a multi-developer realtime setting). But a single file ensures there are no conflicts in paths or methods, and allows for better reusability of elements. When compiled, all JSON files are merged anyway, but for design-time we wanted to minimize the amount of lookups across files.

### Why use object maps instead of arrays of objects?

Object maps ensure each record has a unique identifier. It also makes it easier to reference as a JSON path, for example `/apps/task-manager/name` instead of `/apps[0]/name`. References to object keys can be refactored with a simple find + replace.

### Why a code compiler?

When building Vast, a number of options were considered:

1. Runtime engine, processes JSON files on the fly
2. Compiler, takes JSON files and converts them to Typescript
3. Direct Typescript manipulation via the AST

Past experience with runtime engines has shown they are not really up to the challenge of running high performing code. They also lock users in to a proprietary format which makes migration impossible.

A compiler makes design-time a lot easier, but make validation of logic a lot more difficult. For example, how can we warn the user that a variable is being used before it's been declared? We believe this can be solved using a combination of JSON schema validation and Typescript compiler validation.

Direct Typescript manipulation is also a possibility, but the complexity of the AST would put too much burden on the client to ensure the schema is correct. Using a simplified AST would make parsing TS into JSON more difficult. If the file wasn't perfectly structured, the client may not be able to read it properly.
