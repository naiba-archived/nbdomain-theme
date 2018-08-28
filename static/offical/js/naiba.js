$(document).ready(function () {
  //激活菜单栏
  $(".navbar-burger").click(function () {
    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");
  });
  //切换Tab
  $('.tabs ul li').on('click', function () {
    var number = $(this).data('option');
    $('.tabs ul li').removeClass('is-active');
    $(this).addClass('is-active');
    $('.tabs-container .container-item').removeClass('is-active');
    $('div[class*="container-item"][data-item="' + number + '"]').addClass('is-active');
  });
  //显示隐藏Modal
  $(".modal-show").click(function () {
    var number = $(this).data('option');
    $('div[class*="modal"][data-item="' + number + '"]').addClass("is-active");
  });
  $(".modal-close").click(function () {
    var number = $(this).data('option');
    $('div[class*="modal"][data-item="' + number + '"]').removeClass("is-active");
  });
  //隐藏notification
  $('.notification > button.delete').click(function () {
    $(this).parent().prop("style", "display:none");
    return false;
  })
});

function resetPassword() {
  var what = $('div.container-item.is-active');
  var btn = what.find('button.is-primary');
  var err = what.find('div.notification');
  var iptMail = what.find('input[name=mail]').val()
  var iptVerify = what.find('input[name=verify]').val()
  var iptPassword = what.find('input[name=password]').val()
  //设置loading状态
  btn.addClass('is-loading');
  err.prop('style', '');
  //表单校验
  var errMsg = ''
  if (iptMail.length < 6) {
    errMsg += "邮箱格式不规范\n\n"
  }
  if (iptPassword.length < 6) {
    errMsg += '密码不能少于6位\n\n'
  }
  if (iptVerify.length != 5) {
    errMsg += '验证码不正确\n\n'
  }
  if (errMsg.length > 0) {
    err.text(errMsg)
    btn.removeClass('is-loading');
    return
  }
  $.post('/reset_password', { mail: iptMail, password: iptPassword, verify: iptVerify }).
    always(function () {
      btn.removeClass('is-loading');
    }).fail(function (resp) {
      err.text(resp.responseText);
    }).done(function (resp) {
      window.location.href = "/dashboard"
    })
}

function register(btn) {
  var what = $('div.container-item.is-active');
  var err = what.find('div.notification');
  var iptMail = what.find('input[name=mail]').val()
  var iptVerify = what.find('input[name=verify]').val()
  var iptPassword = what.find('input[name=password]').val()
  var iptRePassword = what.find('input[name=repassword]').val()
  //设置loading状态
  $(btn).addClass('is-loading');
  err.prop('style', '');
  //表单校验
  var errMsg = ''
  if (iptMail.length < 6) {
    errMsg += "邮箱格式不规范\n\n"
  }
  if (iptPassword.length < 6) {
    errMsg += '密码不能少于6位\n\n'
  }
  if (iptPassword !== iptRePassword) {
    errMsg += '两次输入的密码不一致\n\n'
  }
  if (iptVerify.length != 5) {
    errMsg += '验证码不正确\n\n'
  }
  if (errMsg.length > 0) {
    err.text(errMsg)
    $(btn).removeClass('is-loading');
    return
  }
  $.post('/register', { mail: iptMail, password: iptPassword, verify: iptVerify }).
    always(function () {
      $(btn).removeClass('is-loading');
    }).fail(function (resp) {
      err.text(resp.responseText);
    }).done(function (resp) {
      window.location.href = "/dashboard"
    })
}

function index_recaptcha_callback(gtoken) {
  $('div[class*="modal"][data-item="recaptcha"]').removeClass("is-active");
  var what = $('div.container-item.is-active');
  var btn = what.find('[class*="button"][data-option="recaptcha"]');
  var err = what.find('div.notification');
  //设置loading状态
  btn.addClass('is-loading');
  //重置ReCaptcha
  grecaptcha.reset();

  // 通用校验
  var mail = what.find('input[name="mail"]').val();
  if (mail.length == 0) {
    btn.removeClass('is-loading');
    err.prop('style', '');
    err.text('邮箱不能为空');
    return
  }

  switch (what.data('item')) {
    case 1:
      //登录站点
      var pass = what.find('input[name="password"]').val();
      if (pass.length < 6) {
        btn.removeClass('is-loading');
        err.prop('style', '');
        err.text('密码最少为6位');
        return
      }
      $.post('/login', { mail: mail, password: pass, gresp: gtoken }).always(function () {
        btn.removeClass('is-loading');
      }).fail(function (resp) {
        err.prop('style', '');
        err.text(resp.responseText);
      }).done(function (resp) {
        window.location.href = "/dashboard"
      })
      break;
    case 2:
      //注册验证码
      $.post('/verify/mail', { type: 'reg', mail: mail, gresp: gtoken }).always(function () {
        btn.removeClass('is-loading');
      }).fail(function (resp) {
        err.text(resp.responseText);
      }).done(function (resp) {
        err.text('验证码发送成功');
      }).always(function () {
        err.prop('style', '');
      });
      break;
    case 3:
      //重置密码验证码
      $.post('/verify/mail', { type: 'forget', mail: mail, gresp: gtoken }).always(function () {
        btn.removeClass('is-loading');
      }).fail(function (resp) {
        err.text(resp.responseText);
      }).done(function (resp) {
        err.text('验证码发送成功');
      }).always(function () {
        err.prop('style', '');
      });
      break;
  }
}