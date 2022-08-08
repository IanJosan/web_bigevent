$(function() {
    getUserInfo()
    let layer = layui.layer

    const btnLogout = document.querySelector('#btnLogout')
    btnLogout.addEventListener('click',function(){
        //提示是否确认退出
        layer.confirm('确定退出登录', {icon: 3, title:'提示'}, function(index){
            //点击确定后干什么
            localStorage.removeItem('token')
            location.href = '/login.html'
            
            layer.close(index);
          });
    })
})

//获取用户信息
function getUserInfo() {
    $.ajax({
        method:"get",
        url:"/my/userinfo",
        //请求头配置对象
        // headers:{
        //     Authorization:localStorage.getItem('token') || ''
        // },
        success:function(res) {
            if(res.status !== 0) {
                return layui.layer.msg('获取信息失败')
            } 
            // 渲染头像
            renderAvatar(res.data)
        },
        // 无论成功还是失败都会调用
        complete:function(res) {
            //complete回调函数中使用res.responseJSON拿到服务武器响应回来的数据
            if(res.responseJSON.status === 1 ) {
                localStorage.removeItem('token')
                location.href = '/login.html'
            }
        }
    })
}
function renderAvatar(user) {
    let name = user.nickname || user.username
    console.log(name);
    const welcome = document.querySelector('#welcome')
    welcome.innerHTML ='欢迎&nbsp;&nbsp;' + name
    if(user.user_pic !== null) {
        $('.layui-nav-img').attr('src',user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide()
        let first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }

}

