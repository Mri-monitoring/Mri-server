This file serves as a reference of Mri-server's API and is mostly from the Reportr README.

## API and Events

Reportr uses an HTTP REST API to track events. Data are always JSON encoded.

| Endpoint | HTTP Method | Description | Arguments |
| -------- | ----------- | ----------- | --------- |
| /api/infos | GET | Get informations about this instance |  |
| /api/types | GET | Return all event types |  |
| /api/events | POST | Post a new event | `<string>type`, `<object>properties` |
| /api/events | GET | List all events | `<string>type`, `<int>start(0)`, `<int>limit` |
| /api/stats/categories | GET | Get categorized events stats | `<string>type`,`<string>field` |
| /api/stats/time | GET | Get time stats | `<string>type`,`<string>fields`, `<string>interval`, `<string>func` |
| /api/reports | POST | Create a new report | `<string>title` |
| /api/reports | GET | List all reports |  |
| /api/report/:id | PUT | Update a report | `<string>title`, `<array>visualizations` |
| /api/report/:id | DELETE | Remove a report |  |
| /api/alerts | GET | List all alerts |  |
| /api/alerts | POST | Create an alert | `<string>type`, `<string>eventName`, `<string>condition`, `<string>title` |
| /api/data | DELETE | Wipe the database |  | 

#### Special Events

| Name | Description | Properties |
| ---- | ----------- | ---------- |
| reportr.alert | Triggered when an alert is triggered | `<string>type`, `<string>eventName` |


## Configuration

Reportr is configured using environment variables.

| Name | Description |
| ---- | ----------- |
| PORT | Port for running the application, default is 5000 |
| MONGODB_URL | Url for the mongoDB database |
| REDIS_URL | (Optional) Url for a redis database when using worker mode |
| AUTH_USERNAME | Username for authentication |
| AUTH_PASSWORD | Password for authentication |

See [types](#types) for informations about alert configurations.

## Events

An event represents something to monitor at a defined date or point in time. In Mri-server, these events will generally be training events, although in a broader sense they can represent anything. Events that are not based on date should have a field that represents their x-axis, such as epoch or iteration.


## Visualizations

A visualization is a configured way to show data, for example in a pie, bar chart or time graph. For Mri-server, most visualizations will be shown via `plot` charts, which are basic line charts, plotting an independent variable against (possibly multiple) dependent variable(s).

#### Templates

Visualizations accept templates as most of rendering options. Template are processed using [lodash's _.template method](http://lodash.com/docs#template) with some special functions:

- `$.date(date)`: returns a beautiful date

## Alerts

Reportr lets you configure alerts to be triggered when specific condition is valid at a specific interval.

#### Types

| Type | Description | Configuration |
| ---- | ----------- | ------------- |
| webhook | Post an HTTP request to a specific url with the data encoded in the body | |
| mail | Send an email notification | `<string>MAIL_SERVICE`, `<string>MAIL_USERNAME`, `<string>MAIL_PASSWORD`, `<string>MAIL_FROM` |
| sms | Send a text message notification | `<string>TWILIO_SID`, `<string>TWILIO_TOKEN`, `<string>TWILIO_FROM` |

#### Condition

Condition for alerts are really easy to write, for example: `COUNT > 9`, this condition will be valid if at least 10 events have been posted in the alert interval. Conditions can also use the event object, for example: `event.temperature > 80`.

## Trackers

These trackers are available for the original Reportr, and are compatible with Mri-server if so desired. 

| Description | Link |
| ---- | ----------- |
| Google Chrome Navigation | https://github.com/Reportr/tracker-googlechrome |
| Home ambient (temperature, humidity, light) | https://github.com/Reportr/tracker-home-ambient |
| Memory and CPU of computer | https://github.com/Reportr/tracker-machine |
| Battery data | https://github.com/hughrawlinson/tracker-machine-battery |

## Scale it

Reportr can easily be scaled on Heroku (and compatibles), use the `REDIS_URL` to enable a task queue between **workers** and **web** processes.
