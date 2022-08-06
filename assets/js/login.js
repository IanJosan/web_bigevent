window.addEventListener('load',function() {
  const link_reg = document.querySelector('#link_reg')
  const link_login = document.querySelector('#link_login')
  const login_box = document.querySelector('.login-box')
  const reg_box = document.querySelector('.reg-box')

  link_reg.addEventListener('click',function() {
    login_box.style.display = 'none'
    reg_box.style.display = 'block'
  })
  
  link_login.addEventListener('click',function() {
    login_box.style.display = 'block'
    reg_box.style.display = 'none'
  })
  // 从layui中获取form对象
  let form = layui.form
  let layer = layui.layer
  // 通过form.verify()函数自定义校验规则
  form.verify({
    //自定义密码认证规则
    pwd: [
      /^[\S]{6,12}$/
      ,'密码必须6到12位，且不能出现空格'
    ] ,
    //两次密码是否一致
    repwd:function(value) {
      const password = reg_box.querySelector('#zcpassword')
      if (password.value !== value)
      return '两次密码不一致'
    }
  })
  // 注册表单提交事件
  const form_reg = document.querySelector('#form_reg')
  form_reg.addEventListener('submit',function(e) {
    e.preventDefault()
    //发起Ajax的post请求
    let data = {
      username: $('#zcusername').val(), 
      password: $('#zcpassword').val()
    }
    $.post('http://www.liulongbin.top:3007/api/reguser',data,function(res) {
      console.log( $('#zcusername').val());
      if(res.status !== 0 ) return layer.msg(res.message)
      layer.msg('注册成功')
      link_login.click()
    })
  })
  const form_login = document.querySelector('#form_login')
  form_login.addEventListener('submit',function(e) {
    e.preventDefault()
    $.ajax({
      url:'http://www.liulongbin.top:3007/api/login',
      method:'post',
      data:$(this).serialize(),
      success:function(res) {
        if (res.status != 0) return layer.msg('登录失败')
        layer.msg('登陆成功')
        // console.log(res.token);
        localStorage.setItem('token',res.token)
        location.href = '/index.html'
      }
    })
  })




})








// $(function() {
//   // 点击“去注册账号”的链接
//   $('#link_reg').on('click', function() {
//     $('.login-box').hide()
//     $('.reg-box').show()
//   })

//   // 点击“去登录”的链接
//   $('#link_login').on('click', function() {
//     $('.login-box').show()
//     $('.reg-box').hide()
//   })

//   // 从 layui 中获取 form 对象
//   var form = layui.form
//   var layer = layui.layer
//   // 通过 form.verify() 函数自定义校验规则
//   form.verify({
//     // 自定义了一个叫做 pwd 校验规则
//     pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
//     // 校验两次密码是否一致的规则
//     repwd: function(value) {
//       // 通过形参拿到的是确认密码框中的内容
//       // 还需要拿到密码框中的内容
//       // 然后进行一次等于的判断
//       // 如果判断失败,则return一个提示消息即可
//       var pwd = $('.reg-box [name=password]').val()
//       if (pwd !== value) {
//         return '两次密码不一致！'
//       }
//     }
//   })

//   // 监听注册表单的提交事件
//   $('#form_reg').on('submit', function(e) {
//     // 1. 阻止默认的提交行为
//     e.preventDefault()
//     // 2. 发起Ajax的POST请求
//     var data = {
//       username: $('#form_reg [name=username]').val(),
//       password: $('#form_reg [name=password]').val()
//     }
//     $.post('/api/reguser', data, function(res) {
//       if (res.status !== 0) {
//         return layer.msg(res.message)
//       }
//       layer.msg('注册成功，请登录！')
//       // 模拟人的点击行为
//       $('#link_login').click()
//     })
//   })

//   // 监听登录表单的提交事件
//   $('#form_login').submit(function(e) {
//     // 阻止默认提交行为
//     e.preventDefault()
//     $.ajax({
//       url: '/api/login',
//       method: 'POST',
//       // 快速获取表单中的数据
//       data: $(this).serialize(),
//       success: function(res) {
//         if (res.status !== 0) {
//           return layer.msg('登录失败！')
//         }
//         layer.msg('登录成功！')
//         // 将登录成功得到的 token 字符串，保存到 localStorage 中
//         localStorage.setItem('token', res.token)
//         // 跳转到后台主页
//         location.href = '/index.html'
//       }
//     })
//   })
// })
