$(function(){
    let layer = layui.layer
    let form = layui.form
    initArtCateList()
    //调用文章列表数据
    function initArtCateList() {
        $.ajax({
            method:'get',
            url:'/my/article/cates',
            success:function(res) {
                console.log(res.message);
                let htmlStr =  template('tpl-table',res)
                $('tbody').html(htmlStr)
            }
        })
    }

    //为添加按钮绑定点击事件
    let indexAdd = null
    $('#btnAddCate').on('click',function() {
        indexAdd = layer.open({
            type:1,
            area:['500px','250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    //代理形式为form-add绑定submit事件
    $('body').on('submit','#form-add',function(e) {
        e.preventDefault()
        $.ajax({
            method:'post',
            url:'/my/article/addcates',
            data:$(this).serialize(),
            success:function(res) {
                if(res.status !== 0) {
                    return layer.msg ('新增类别失败')
                }
                initArtCateList()
                layer.msg('新增类成功')
                layer.close(indexAdd)
            }
        })
    })
    //通过代理绑定选择事件
    let indexEdit = null
    $('tbody').on('click','.btn-edit',function() {
        indexEdit = layer.open({
            type:1,
            area:['500px','250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        let id = $(this).attr('data-id')
        $.ajax({
            method:'get',
            url:'/my/article/cates/' + id,
            success:function(res) {
                form.val('form-edit',res.data)
            }
        })
    })
    $('body').on('submit',"#form-edit",function(e) {
        e.preventDefault()
        $.ajax({
            method:'post',
            url:"/my/article/updatecate",
            data:$(this).serialize(),
            success:function(res) {
                if(res.status !== 0) {
                    return layer.msg('更新失败')
                }
                layer.msg('更新成功')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    //删除按钮点击
    $("tbody").on('click','.btn-delete',function() {
        let id = $(this).attr('data-id')
        //删除提示
        layer.confirm('确认删除', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method:'get',
                url:'/my/article/deletecate/' + id,
                success:function(res) {
                    if(res.status !== 0 ){
                        return layer.msg('删除分类失败')
                    }
                    layer.msg('删除分类成功')
                    layer.close(index);
                    initArtCateList()
                }
            })      
          });
    })
    

















})