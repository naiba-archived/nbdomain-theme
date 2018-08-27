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

function index_recaptcha_callback(gtoken) {
  $('div[class*="modal"][data-item="recaptcha"]').removeClass("is-active");
  var what = $('div.container-item.is-active');
  var btn = what.find('[class*="button"][data-option="recaptcha"]');
  var err = what.find('div.notification');
  //设置loading状态
  btn.addClass('is-loading');
  //重置ReCaptcha
  grecaptcha.reset();
  console.log(what.data('item'))
  switch (what.data('item')) {
    case 1:
      //登录站点
      break;
    case 2:
      //注册验证码
      console.log('发送注册验证码')
      var mail = what.find('input[name="mail"]').val();
      if (mail.length == 0) {
        btn.removeClass('is-loading');
        err.prop('style', '');
        err.text('邮箱不能为空');
        return
      }
      $.post('/verify/mail', { type: 'reg', mail: mail }).always(function () {
        btn.removeClass('is-loading');
      }).fail(function (resp) {
        console.log(resp)
        err.prop('style', '');
        err.text(resp.responseText);
      }).done(function (resp) {
        err.prop('style', '');
        err.text('验证码发送成功');
      });
      break;
    case 3:
      //重置密码验证码
      break;
  }
}