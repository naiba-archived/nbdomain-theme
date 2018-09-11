document.addEventListener('DOMContentLoaded', () => {

  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {

    // Add a click event on each of them
    $navbarBurgers.forEach(el => {
      el.addEventListener('click', () => {

        // Get the target from the "data-target" attribute
        const target = el.dataset.target;
        const $target = document.getElementById(target);

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        el.classList.toggle('is-active');
        $target.classList.toggle('is-active');

      });
    });
  }

});

function toJSON(form) {
  var obj = {};
  var elements = form.querySelectorAll("input, select, textarea");
  for (var i = 0; i < elements.length; ++i) {
    var element = elements[i];
    var name = element.name;
    var value = element.value;
    if (name) {
      obj[name] = element.type == "number" ? parseInt(value) : value;
    }
  }
  return obj;
}

function onSubmit() {
  let form = toJSON(document.getElementById("offer"));
  //检查填写规范
  let msg = ""
  if (form.Name.length < 2 || form.Name.length > 20) {
    msg += "姓名长度必须在2到20之间(Name length 2 - 20)\n"
  }
  if (!/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(form.Mail)) {
    msg += "邮箱格式不规范(Email not validate)\n"
  }
  if (!["$", "€", '¥'].includes(form.Currency)) {
    msg += "不支持的货币(No supported currency)\n"
  }
  if (!form.Amount || form.Amount < 1) {
    msg += "报价必须大于1(max-min offer 1)\n"
  }
  if (form['g-recaptcha-response'].length < 10) {
    msg += "请通过ReCaptcha验证(ReCaptcha validate required)\n"
  }
  if (msg.length > 0) {
    alert(msg)
  } else {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", '', true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        if (xhr.status == 200) {
          alert("提交成功(Submit Successful)")
          document.getElementById("offer").reset()
        } else {
          alert(xhr.responseText)
        }
        grecaptcha.reset()
      }
    }
    xhr.send(JSON.stringify(form));
  }
  return false;
}
