async function newCommentHandler(event) {
    event.preventDefault();

    const comment_body = document.getElementById("comment").value.trim();
  
    if (comment_body) {
      const response = await fetch("/api/comment", {
        method: "POST",
        body: JSON.stringify({
          comment_content,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        document.location.reload();
      } else {
        alert(response.statusText);
      }
    }
  }
  
  console.log(document.getElementById("comment-form"));
  document
    .getElementById("comment-form")
    .addEventListener("submit", newCommentHandler);