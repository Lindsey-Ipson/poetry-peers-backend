# Poetry Peers

Deployed at https://poetry-peers-backend.onrender.com

Frontend code base: 

* https://github.com/Lindsey-Ipson/poetry-peers-frontend
* Deployed at https://poetry-peers-frontend.onrender.com

## Summary

This is the backend of Poetry Peers, a collaborative poetry analysis application. It responds to requests from the frontend and serves data necessary for all core functionalities of the site including fetching data about users, poems, themes, and tags, and the relationships between them. It includes models for User, Poem, Theme, and Tag, which contain necessary methods for querying the PostgreSQL database, hosted by ElephantSQL, and responding with data in JSON format. Its routing follows RESTful and typical CRUD (create, retrieve, update, delete) conventions.  

Paired together with the frontend, and hosted by Render, the Poetry Peers application allows users to explore new poems by keyword, theme, or a selection of random poems. Users can tag specific lines in a poem with a new or pre-existing theme, and provide a brief analysis/explanation. These tags are then viewable to all other users when they view that poem. The purpose of the application is to allow users to explore new poems and poetry themes, while gaining new insights into the literature from fellow poetry readers.

## API

The frontend of the application utilizes an external API PoetryDB (https://poetrydb.org/index.html). This API holds over 3000 poems in the public domain, which are searchable by title, author, or linecount. It can also return any number of random poems. It accepts all data in query parameters and returns JSON with poem data consisting of author, title, lines, and line count.

The general format of the API is:

`/<input field>/<search term>[;<search term>][..][:<search type>][/<output field>][,<output field>][..][.<format>]`

When poems are tagged with a theme by the user, the poem and tag are then added to the Poetry Peers ElephantSQL database, to ensure tag data remains accurate should the poem in the PoetryDB database ever change. The id of each poem is a hash of the title and author, to ensure no duplicate poems (with same author and title) are added when new tags are created.

## Routes

### Auth Routes

#### POST /auth/token

* Authenticates a user and returns a JWT token.
* Expects: { username, password }
* Returns: { token }

#### POST /auth/register

* Registers a new user and returns a JWT token.
* Expects: { username, password, firstName, lastName, email }
* Returns: { token }

### Poem Routes

#### POST /poems

* Creates a new poem entry.
* Expects: { title, author, lineCount, lines }
* Returns: { id, title, author, lineCount, lines }

#### GET /poems/:id

* Retrieves a poem by its ID.
* Returns: { poem }

### Tag Routes

#### POST /tags

* Creates a new tag for a poem.
* Expects body: { themeName, poemId, highlightedLines, analysis, username }
* Returns: { tag }

#### GET /tags/by-poem/:poemId

* Retrieves tags associated with a specific poem.
* Returns: { tags }

#### GET /tags/by-user/:username

* Retrieves tags created by a specific user.
* Returns: { tags }

#### GET /tags/by-theme/:themeName

* Retrieves tags associated with a specific theme.
* Returns: { tags }

#### DELETE /tags

* Deletes a tag based on a composite key of themeName, poemId, and highlightedLines.
* Expects query parameters: themeName, poemId, highlightedLines
Returns: { deleted }

### Theme Routes

#### POST /themes

* Creates a new theme.
* Expects body: { name }
* Returns: { theme }

#### GET /themes

* Retrieves a list of themes, optionally filtered by name.
* Expects query parameter: name
* Returns: { themes }

### User Routes

#### POST /users (admin only)

* Adds a new user.
* Expects body: { username, firstName, lastName, password, email, isAdmin }
* Authorization required: admin

#### GET /users/:username

* Retrieves details of a specific user.
* Authorization required: admin or the user themselves

#### PATCH /users/:username

* Updates details of a specific user.
* Expects body: { firstName, lastName, password, email }
* Authorization required: admin or the user themselves

#### DELETE /users/:username

* Deletes a specific user.
* Authorization required: admin or the user themselves

## Frontend Standard User Flow

After signing up, the site’s main functionality can be accessed through the navigation bar. Clicking the logo/brand name takes the user to a homepage which contains instructions for navigating the site. The Poems tab renders twenty new random poems each time it is accessed, and also allows the user to search all poems in the external API by title. It renders poetry cards for all poems which include the poem title, author, first few lines of the poem, and line count. Clicking on any of the poems takes the user to an analyze-poem page, which finds all tags users have submitted for that poem, and displays a uniquely colored badge next to all highlighted lines for each tag. Clicking on any of these badges results in a small modal pop-up overlaying the page which includes information about the tag including user, post date, and analysis. Clicking on the theme name in these modals takes the user to an overview of that theme.

The Theme tab displays a list of all themes, searchable by name, and includes links to all poems that have been tagged with that theme. When clicking a poem from the Themes page, the first matching tag with that theme is automatically rendered navigation to the poem. From the Themes tab, users can also click the theme name, which takes the user to a specific theme overview page which displays all highlighted lines and analyses for all poems associated with that tag. Clicking any of the poems from this page also auto-triggers a pop-up of the first matching tag to that theme in the subsequent poem analysis page.

The Contributions tab contains statistics about a user's account history and allows them to review and delete tags they have made. Clicking on a theme from this page takes the user to that themes' page overview, while clicking a poem from this page directs the user to the poem analysis page with that tag modal auto-displayed upon navigation.

## Frontend Example Screenshots
### Homepage
![Homepage Screenshot](https://github.com/Lindsey-Ipson/poetry-peers-backend/blob/main/README_files/HomepageScreenshot.png)
### Explore Poems Random
![Explore Poems Random Screenshot](https://github.com/Lindsey-Ipson/poetry-peers-backend/blob/main/README_files/ExplorePoemsRandomScreenshot.png)
### Explore Poems Search
![Explore Poems Search Screenshot](https://github.com/Lindsey-Ipson/poetry-peers-backend/blob/main/README_files/ExplorePoemsSearchScreenshot.png)
### Explore Themes
![Explore Themes Screenshot](https://github.com/Lindsey-Ipson/poetry-peers-backend/blob/main/README_files/ExploreThemesScreenshot.png)
### Analyze Poem
![Analyze Poem Screenshot](https://github.com/Lindsey-Ipson/poetry-peers-backend/blob/main/README_files/AnalyzePoemScreenshot.png)
### Create Tag
![Create Tag Screenshot](https://github.com/Lindsey-Ipson/poetry-peers-backend/blob/main/README_files/CreateTagScreenshot.png)
### View Theme
![View Theme Screenshot](https://github.com/Lindsey-Ipson/poetry-peers-backend/blob/main/README_files/ViewThemeScreenshot.png)
### View Account Contributions
![View Account Contributions Screenshot](https://github.com/Lindsey-Ipson/poetry-peers-backend/blob/main/README_files/ContributionsScreenshot.png)

## Data Schema
![Database Schema](https://github.com/Lindsey-Ipson/poetry-peers-backend/blob/main/README_files/DataSchemaDiagram.png)

## Main Technology Used:

* Javascript
* Express
* Node 
* JSON Schema
* JSON Web Token
* Bcrypt
* Jest
* SuperTest