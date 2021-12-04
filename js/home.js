import {
  getAuth,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.5.0/firebase-auth.js";

const auth = getAuth();

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);

    const post_list = data;

    post_list.forEach((post) => {
      document.getElementById("postContainer").innerHTML += `
            <div class="card bg-light shadow-sm mb-5" id=${post.post_id}>
              <div class="card-body">
                <div class="row">
                  <div class="col-lg-1" style="padding-right: 0">
                    <img
                      src="images/person1.jpg"
                      class="img-fluid"
                      style="border-radius: 50%"
                    />
                  </div>
                  <div class="col-lg-8">
                    <h5 class="mt-3 ms-2">${post.author}</h5>
                  </div>
                  <div class="col-lg-3 py-3" style="text-align: right">
                    <span>${post.date_posted}</span>
                  </div>
                </div>
                <div class="row mt-4 px-2">
                  <h5>${post.title}</h5>
                  <p style="text-align: justify">${post.description}</p>
                </div>
                <div class="row px-2">
                  <div class="col-lg-2">
                    <button
                      class="btn btn-sm btn-outline-success"
                      style="width: 100%" onclick="upvotePost('${post.id}')"
                    >
                      <i class="bi bi-hand-thumbs-up me-1"></i>
                      <span class="me-3">True</span>
                      <span>${post.upvotes}</span>
                    </button>
                    <button
                      class="btn btn-sm btn-outline-danger mt-2"
                      style="width: 100%" onclick="downvotePost('${post.id}')"
                    >
                      <i class="bi bi-hand-thumbs-down me-1"></i>
                      <span class="me-3">False</span>
                      <span>${post.downvotes}</span>
                    </button>
                  </div>
                  <div class="col-lg-3 offset-lg-7" style="text-align: right;">
                    <h4 class="my-3">${post.conclusion}</h4>
                  </div>
                </div>
              </div>
            </div>
    `;
    });
  })
  .catch((error) => console.error(error));

document.addEventListener("DOMContentLoaded", async (e) => {
  const name = sessionStorage.getItem("name");
  console.log(name);
  const newPostForm = document.getElementById("newPostForm");
  newPostForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newPostTitle = newPostForm.newPostTitle.value.trim();
    const newPostDescription = newPostForm.newPostDescription.value.trim();

    if (newPostTitle.length == 0 || newPostDescription.length == 0) {
      document.getElementById("createPostSuccess").innerText = "";
      document.getElementById("createPostError").innerText =
        "Fields cannot be empty";
      return;
    }

    const authorId = await sessionStorage.getItem("uid");
    const authorName = await sessionStorage.getItem("name");
    console.log(authorId, authorName);

    console.log(newPostTitle, newPostDescription);
    // document.getElementById("createPostSuccess").innerText =
    //   "Post created successfully!";

    await fetch(url + "createpost", {
      method: "POST",
      body: JSON.stringify({
        author: authorName,
        author_id: authorId,
        title: newPostTitle,
        description: newPostDescription,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        document.getElementById("createPostError").innerText = "";
        window.location.reload();
      })
      .catch((error) => console.error(error));

    newPostForm.reset();
  });

  document.getElementById("logoutButton").addEventListener("click", (e) => {
    e.preventDefault();

    signOut(auth)
      .then(() => {
        sessionStorage.uid = "";
        window.location.href = "index.html";
      })
      .catch((error) => {
        alert(error);
      });

    console.log("hello");
  });
});
