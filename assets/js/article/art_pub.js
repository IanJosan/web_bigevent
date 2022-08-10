$(function() {
    var layer = layui.layer
    var form = layui.form
    initEditor()
    initCate()
    //定义加载文章分类方法
    function initCate() {
        $.ajax({
            method:'get',
            url:'/my/article/cates',
            success:function(res) {
                if (res.status !== 0 ) {
                    return layer.msg('初始化文章失败')
                }
                // 调用模板引擎，渲染下拉菜单
                var htmlStr = template('tpl-cate',res)
                $('[name=cate_id]').html(htmlStr)
                //记得调用 重新渲染
                form.render()
            }
        })
    }

     // 1. 初始化图片裁剪器
     var $image = $('#image')
     
     // 2. 裁剪选项
     var options = {
       aspectRatio: 400 / 280,
       preview: '.img-preview'
     }
     
     // 3. 初始化裁剪区域
     $image.cropper(options)

     //为封面的按钮绑定点击事件处理函数
    $('#btnChooseImage').on('click',function() {
        $('#coverFile').click()
    })
    $('#coverFile').on('change',function(e) {
        //获取文件列表数组
        var files = e.target.files
        //判断是否选择文件
        if(files.length === 0) {
            return 
        }
        var newImgURL = URL.createObjectURL(files[0])
        //为裁剪区域设置图片
        $image
        .cropper('destroy')      // 销毁旧的裁剪区域
        .attr('src', newImgURL)  // 重新设置图片路径
        .cropper(options)        // 重新初始化裁剪区域
    })

    let art_state = '已发布'
    //为存为草稿绑定点击事件处理函数
    $('#btnSave2').on('click',function() {
        art_state = '草稿'
    })
    //为表单绑定submit提交事件
    $('#form-pub').on('submit',function(e) {
        e.preventDefault()
        //基于form表单快速创建formdata对象
        let fd = new FormData($(this)[0])
        //存入文章发布状态
        fd.append('state',art_state)
        fd.forEach(function(v,k) {
            console.log(k,v);
        })
        // 封面输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                //将文件储存到fd中
                fd.append('cover_img',blob)
                //发起ajax
                publishArticle(fd)
            })
    })
    function publishArticle(fd) {
        $.ajax({
            method:'post',
            url:'/my/article/add',
            data:fd,
            // 如果向服务器提交的是formdata格式的数据必须添加一下两个配置项
            contentType:false,
            processData:false,
            success:function(res) {
                if(res.status !== 0) {
                    return layer.msg('发布文章失败')
                } 
                layer.msg('发布文章成功')
                location.href = '/article/art_list.html'
            }
        })
    }















})