# hugo-bluesky-comments
A little hugo module to use bluesky for blog comments

This is a hugo module based on the Bluesky Comments [ npm module here by Cory Zue](https://github.com/czue/.bluesky-comments). 

# How to Use This Module in Hugo

Add the Module as a Dependency In your Hugo site’s config.toml:

```
module:
  imports:
    - path: github.com/your-username/hugo-module-bluesky-comments
```

Add the Partial to Your Templates Include the comment.html partial in your post layout (e.g., single.html):

```
{{ partial "comment.html" . }}
```

Specify the Bluesky URI in Front Matter Add the blueskyUri parameter to the front matter of your posts:

```
---
title: "My Blog Post"
date: 2024-11-27
blueskyUri: "https://bsky.app/profile/yourprofile/post/yourpostid"
---
```

Build and Test Run your Hugo site and confirm that the comments section loads properly.


