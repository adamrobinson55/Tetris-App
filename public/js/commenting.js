const newCommentHandler = async (event) => {
  event.preventDefault();
  console.log('HELP ME')
  const comment_content = document.querySelector("#comment").value.trim();
  
  if (comment_content) {
    const response = await fetch("/api/comment", {
      method: "POST",
      body: JSON.stringify({
        comment_content,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(comment_content+'hi')
    if (response.ok) {
      console.log('WOW!')
    } else {
      alert(response.statusText);
    }
  }
};

document
  .querySelector(".comment-form")
  .addEventListener("submit", newCommentHandler);
