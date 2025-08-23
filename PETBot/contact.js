//Email Notification For Contact.
const EMAILJS_USER_ID = "RNtEWiuOc9xUCwDif";     
const EMAILJS_SERVICE_ID = "service_9a0u026";
const EMAILJS_TEMPLATE_ID = "template_ayqg9f8";

// initialize
  (function(){
    emailjs.init(EMAILJS_USER_ID);
  })();

  const form = document.getElementById('contact-form');
  const sendBtn = document.getElementById('sendBtn');
  const status = document.getElementById('status');
  const error_message = document.getElementById("system_error");
  error_message.style.padding = "10px";

  // By default messages hide han
  status.classList.add("hide");
  error_message.classList.add("hide");

  // set current time into hidden field (optional)
  form.querySelector('input[name="time"]').value = new Date().toLocaleString();
  
  form.addEventListener('submit', function(e){
    e.preventDefault();
    
    // Reset previous messages
    status.textContent = "";
    error_message.textContent = "";
    status.classList.add("hide");
    error_message.classList.add("hide");

    if(!validate()) {
      status.style.color = 'red';
      status.textContent = '❌ Sending failed';
      status.classList.remove('hide');
      
      setTimeout(() => {
          status.classList.add('hide');
        }, 3000);
        
        sendBtn.disabled = false;
        sendBtn.textContent = 'Submit Query';
      return; //agr validation fail ho jaye to neeche ka code run nahi hooga.
    }
    
    sendBtn.disabled = true;
    sendBtn.textContent = 'Sending...';

    //check if internet is available.
    if(!navigator.onLine) {
      error_message.textContent = '⚠️ Internet connection not available. Please check and try again.';
      error_message.classList.remove("hide");

      setTimeout(() => {
        error_message.classList.add('hide');
      }, 5000);

      status.style.color = 'red';
      status.textContent = '❌ Sending failed';
      status.classList.remove('hide');
      
      setTimeout(() => {
          status.classList.add('hide');
        }, 3000);

      //Reset button.
      sendBtn.disabled = false;
      sendBtn.textContent = 'Submit Query';
      return;
    }
      
    emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, this)
      .then(function(resp) {
        // success
        status.style.color = 'green';
        status.textContent = '✅ Form submitted successfully';
        status.classList.remove("hide");

        //3 sec baad hide kardo
        setTimeout(() => {
          status.classList.add('hide');
        }, 3000);

        form.reset();
        
        // put time again on reset
        form.querySelector('input[name="time"]').value = new Date().toLocaleString();

        sendBtn.disabled = false;
        sendBtn.textContent = 'Submit Query';

      }, function(err) {
        // error
        console.error('EmailJS error:', err);
        status.style.color = 'red';
        status.textContent = '❌ Sending failed';
        status.classList.remove("hide");

        //3 sec baad hide kardo
        setTimeout(() => {
          status.classList.add('hide');
        }, 3000);

        sendBtn.disabled = false;
        sendBtn.textContent = 'Submit Query';
      });
  });

//Contact Form Validation.
function validate() {
  var name = document.getElementById("name").value;
  var subject = document.getElementById("subject").value;
  var phone = document.getElementById("phone").value;
  var email = document.getElementById("email").value;
  var message = document.getElementById("message").value;
  var error_message = document.getElementById("validate_error");
  error_message.style.padding = "10px";
  var text;

  // Asian names can be three-letter names such as Lee or Mae hence, limit >=3.
  if(name.length < 3) {
    text = "Please Enter Valid Name (Minimum 3 characters)";
    error_message.innerHTML = text;
    error_message.classList.remove("hide");

    setTimeout(() => {
      error_message.classList.add('hide');
    }, 5000);
    return false;
  }
  if(subject.length < 10) {
    text = "Please Enter Correct Subject (Minimum 10 characters)";
    error_message.innerHTML = text;
    error_message.classList.remove("hide");

    setTimeout(() => {
      error_message.classList.add('hide');
    }, 5000);
    return false;
  }
  if(isNaN(phone) || phone.length < 10) {
    text = "Please Enter Valid Phone Number (10 digit)";
    error_message.innerHTML = text;
    error_message.classList.remove("hide");

    setTimeout(() => {
      error_message.classList.add('hide');
    }, 5000);
    return false;
  }
  if(!/^[a-zA-Z0-9._-]+@gmail\.com$/.test(email)) {
    text = "Please Enter Valid Email"
    error_message.innerHTML = text;
    error_message.classList.remove("hide");

    setTimeout(() => {
      error_message.classList.add('hide');
    }, 5000);
    return false;
  }
  // Message should have more than 140 characters.
  if(message.length <= 140) {
    text = "Please enter more than 140 characters in message";
    error_message.innerHTML = text;
    error_message.classList.remove("hide");

    setTimeout(() => {
      error_message.classList.add('hide');
    }, 5000);
    return false;
  }
  // Message should have less than 500 characters.
  if(message.length >= 500) {
    text = "Please enter less than 500 characters in message";
    error_message.innerHTML = text;
    error_message.classList.remove("hide");

    setTimeout(() => {
      error_message.classList.add('hide');
    }, 5000);
    return false;
  }
  error_message.style.display = "none";
  return true;
}

