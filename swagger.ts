const swagger = `
swagger: '2.0'
info:
  title: Team Events API
  version: 1.0.0
paths:
  /auth/google:
    get:
      tags:
        - Auth
      summary: Authenticate with Google
      description: This route is used to initiate Google OAuth authentication.
      responses:
        302:
          description: Redirects to Google OAuth for authentication.
  /auth/google/callback:
    get:
      tags:
        - Auth
      summary: Google OAuth Callback
      description: This route handles the callback after Google OAuth authentication.
      responses:
        201:
          description: User created and authenticated successfully.
        200:
          description: User authenticated successfully.
        500:
          description: Authentication error.
  /auth/twitter:
    post:
      tags:
        - Auth
      summary: Authenticate with Twitter
      description: This route is used to initiate Twitter authentication.
      responses:
        302:
          description: Redirects to Twitter for authentication.
  /auth/twitter/callback:
    post:
      tags:
        - Auth
      summary: Twitter Authentication Callback
      description: This route handles the callback after Twitter authentication.
      responses:
        200:
          description: User authenticated successfully.
        401:
          description: Authentication failed.
        500:
          description: Authentication error.
  /auth/logout:
    post:
      tags:
        - Auth
      summary: Logout
      description: This route is used to log out the user.
      responses:
        302:
          description: Redirects to the homepage after logging out.
  /comment:
    post:
      tags:
        - Comment
      summary: Create Comment
      description: This route is used to create a comment.
      responses:
        201:
          description: Comment created successfully.
      500:
        description: Comment creation error.
    get:
      tags:
        - Comment
      summary: Get Comments
      description: This route is used to get comments.
  /event:
    post:
      tags:
        - Event
      summary: Create Event
      description: This route is used to create an event.
      responses:
        201:
          description: Event created successfully.
        500:
          description: Event creation error.
    get:
      tags:
        - Event
      summary: Get All Events
      description: This route is used to get all events created by all users.
      responses:
        200:
          description: Events retrieved successfully.
        404:
          description: No events found.
  /event/friends:
    get:
      tags:
        - Event
      summary: Get Friend Events
      description: This route is used to get all events of members of shared groups.
      responses:
        200:
          description: Friend events retrieved successfully.
        404:
          description: No friend events found.
  /event/search:
    get:
      tags:
        - Event
      summary: Search Events
      description: This route is used to search for events by name.
      parameters:
        - name: keyword
          in: query
          required: true
          type: string
      responses:
        200:
          description: Events matching the search retrieved successfully.
        404:
          description: No matching events found.
  /event/info/{eventId}:
    get:
      tags:
        - Event
      summary: Get Event by ID
      description: This route is used to get a particular event by its ID.
      parameters:
        - name: eventId
          in: path
          required: true
          type: string
      responses:
        200:
          description: Event retrieved successfully.
        404:
          description: Specified event does not exist.
    delete:
      tags:
        - Event
      summary: Delete Event
      description: This route is used to delete a particular event.
      parameters:
        - name: eventId
          in: path
          required: true
          type: string
      responses:
        200:
          description: Event deleted successfully.
        404:
          description: Event not found.
  /group:
    post:
      tags:
        - Group
      summary: Create Group
      description: This route is used to create groups (no page on the design for this, but just use the information in the table).
      responses:
        201:
          description: Group created successfully.
        500:
          description: Group creation error.
  /group/{id}:
    get:
      tags:
        - Group
      summary: Get User Groups
      description: This route is used to get all groups that a user is a part of.
      parameters:
      - name: userId
        in: path
        required: true
        type: string
    responses:
      200:
        description: User group fetched successfully.
      404:
        description: User not found.
  /group/info/{groupId}:
    get:
      tags:
        - Group
      summary: Get Group by ID
      description: This route is used to get a particular group by its ID.
  /group/event/{groupId}:
    get:
      tags:
        - Group
      summary: Get Events in Group
      description: This route is used to get all events under a specific group.

`;

export default swagger;
