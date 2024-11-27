// Initialize Bluesky comments
window.initBlueskyComments = async function (elementId, options) {
  console.log("Initializing Bluesky comments with options:", options);
  const element = document.getElementById(elementId);
  if (!element) {
      console.error(`Element with ID "${elementId}" not found.`);
      return;
  }

  const formatUri = (uri) => {
      if (!uri.startsWith("at://") && uri.includes("bsky.app/profile/")) {
          const match = uri.match(/profile\/([\w.]+)\/post\/([\w]+)/);
          if (match) {
              const [, did, postId] = match;
              return `at://${did}/app.bsky.feed.post/${postId}`;
          }
      }
      return uri;
  };

  const fetchThreadData = async (uri) => {
      const atUri = formatUri(uri);
      const params = new URLSearchParams({ uri: atUri });
      const apiUrl = `https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?${params.toString()}`;
      try {
          const response = await fetch(apiUrl, {
              method: "GET",
              headers: {
                  Accept: "application/json",
              },
          });
          if (!response.ok) {
              throw new Error(`Failed to fetch post thread: ${response.statusText}`);
          }
          return await response.json();
      } catch (err) {
          console.error(err);
          return null;
      }
  };

  const renderComments = (thread, element) => {
      if (!thread || !thread.replies || thread.replies.length === 0) {
          element.innerHTML = "<p>No comments yet. Be the first to reply on Bluesky!</p>";
          return;
      }

      const sortedReplies = thread.replies.sort((a, b) => (b.post.likeCount ?? 0) - (a.post.likeCount ?? 0));
      const commentsHTML = sortedReplies
          .map((reply) => {
              const author = reply.post.author;
              const avatar = author.avatar ? `<img src="${author.avatar}" alt="${author.handle}" />` : `<div class="avatar-placeholder"></div>`;
              return `
              <div class="comment">
                  <div class="comment-header">
                      <a href="https://bsky.app/profile/${author.did}" target="_blank">${avatar} <span>${author.displayName ?? author.handle}</span></a>
                  </div>
                  <div class="comment-body">
                      <p>${reply.post.record.text}</p>
                      <a href="https://bsky.app/profile/${author.did}/post/${reply.post.uri.split("/").pop()}" target="_blank">View on Bluesky</a>
                  </div>
              </div>`;
          })
          .join("");

      element.innerHTML = `
          <div class="comments-container">
              ${commentsHTML}
          </div>`;
  };

  const threadData = await fetchThreadData(options.uri);
  if (threadData) {
      renderComments(threadData.thread, element);
  } else {
      element.innerHTML = "<p>Unable to load comments. Try again later.</p>";
  }
};
