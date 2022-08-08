$(function() {
    let form = layui.form
    let layer = layui.layer
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度在1~6个字符以内'
            }
        }
    })
    initUserInfo ()
    // 初始化用户基本信息
    function initUserInfo () {
        $.ajax({
            method: 'get',
            url:'/my/userinfo',
            // headers:{
            //     Authorization:localStorage.getItem('token') || ''
            // },
            success: function(res) {
                if (res.status !== 0) {
                    console.log(res.message);
                    return layer.msg ('获取用户信息失败')
                }
                console.log(res);
                // 调用form.val() 快速为表单赋值  layui属性
                form.val('formUserInfo',res.data)
            }
        })
    }
    //重置表单数据
    $('#btnReset').on('click',function(e) {
        e.preventDefault()
        initUserInfo ()
    })
    //监听表单提交事件
    $('.layui-form').on('submit',function(e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url:'/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if(res.status !== 0) {
                    console.log(res.massage);
                    return layer.msg('更新数据失败')
                }
                layer.msg('更新数据成功')
                console.log(res.message);
                // 调用父页面方法重新渲染用户名头像
                window.parent.getUserInfo()
            }
        })
    })



})