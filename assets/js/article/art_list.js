$(function(){
    let layer = layui.layer
    let form = layui.form
    var laypage = layui.laypage;
    // 定义时间过滤器
    template.defaults.imports.dateFormat = function(date) {
        const dt = new Date(date)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    function padZero(n) {
        return n > 9? n: '0' + n
    }
    //定义查询参数对象，请求数据的时候将请求参数对象发送到服务器
    var q = {
        pagenum: 1, //页码
        pagesize: 2,//一页几条
        cate_id: '', // 文章分类id
        state: '' // 文章发布状态
    }

    initTable()
    initCate()

    //获取文章列表数据
    function initTable(){
        $.ajax({
            method:'get',
            url:'/my/article/list',
            data: q,
            success:function(res) {
                if(res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                //使用template渲染数据
                var htmlStr = template('tpl-table',res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }
    //初始化文章分类
    function initCate(){ 
        $.ajax({
            method:'get',
            url:"/my/article/cates",
            success:function(res) {
                if(res.status !== 0) {
                    return layer.msg ('获取分类数据失败')
                }
                // 调用模板引擎渲染分类可选项
                var htmlStr = template('tpl-cate',res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
                
            }
        })
    }

    //筛选表单绑定submit事件
    $('#form-search').on('submit',function(e) {
        e.preventDefault()
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 为查询参数对象q属性赋值
        q.cate_id = cate_id
        q.state = state
        initTable()
    })
    // 定义渲染分页的方法
    function renderPage(total) {
        //调用laypage.render()方法来渲染分页结构
        laypage.render({
            elem:'pageBox',// 分页容器id
            count:total,//总数据条数
            limit:q.pagesize,//每页显示几条
            curr:q.pagenum,//默认选中那一夜
            //分页切换触发，点击页码触发，调用layrender触发
            jump:function(obj,first){
                //最新页码值赋值到q
                q.pagenum = obj.curr
                //把最新的条目数赋值到q
                q.pagesize = obj.limit
                //更具最新的q获取对应数据列表渲染表格
                if(!first) {
                    initTable()
                }
            },
            layout:['count','limit','prev','page','next','skip'], //上一页页码条下一页
            limits:[2,3,5,10]

        })
    }
    //代理形式绑定删除按钮
    $('tbody').on('click',function() {
        //获取删除按钮个数
        var len = $('.btn-delete').length
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method:'get',
                url:'/my/article/delete/' + id,
                success:function(res) {
                    if(res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')
                    //数据删除完成后判断是否还有数据，如果没有就页码值-1再调用initable方法
                    if(len === 1) {
                        //len 值为1 证明删除完毕后没有数据 
                        q.pagenum = q.pagenum === 1? 1: q.pagenum - 1
                    }
                    initTable()
                }
            })
            
            layer.close(index);
          });
    })












})