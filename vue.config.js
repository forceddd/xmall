const fs = require('fs');

//分页函数
function pagination(pageSize, currentPage, data) {
    const skipNum = (currentPage - 1) * pageSize;
    return skipNum + pageSize >= data.length ? data.slice(skipNum, data.length) : data.slice(skipNum, skipNum + pageSize)
}
//排序函数 sort:1升序 a<b   -1降序 a>b
function sortBy(attr, sort) {
    return function (a, b) {
        return sort > 0 ? a[attr] - b[attr] : b[attr] - a[attr]
    }
}
//过滤函数
function range(data, gt, lt) {
    if (lt) {//lt>0
        //判断最小值是否合法
        return gt >= 0 ? data.filter(item => item.salePrice >= gt && item.salePrice <= lt) : data.filter(item => item.salePrice <= lt)
    } else {//lt=0 或者 lt =undefined
        return gt >= 0 ? data.filter(item => item.salePrice >= gt) : false;
    }

}
module.exports = {
    devServer: {
        before(app) {
            app.get('/api/goods/home', (req, res) => {
                fs.readFile('./db/home.json', 'utf8', (err, data) => {
                    //fs获取的是字节流 还需要转换成json
                    if (!err) {
                        res.json(JSON.parse(data))
                    }
                })
            })
            app.get('/api/goods/allGoods', (req, res) => {
                //获取前端地址栏的查询字符串
                const page = parseInt(req.query.page);
                const size = parseInt(req.query.size);
                const sort = parseInt(req.query.sort);
                const gt = parseInt(req.query.gt);
                const lt = parseInt(req.query.lt);
                const cid = req.query.cid;
                let newData = [];
                fs.readFile('./db/allGoods.json', (err, data) => {
                    //获取到的是字节流 要先解析
                    const { result } = JSON.parse(data);
                    //判断是否需要过滤
                    let allData = (gt || lt) ? range(result.data, gt, lt) : result.data;
                    //分页显示
                    newData = pagination(size, page, allData);
                    if (cid === '1184') { //品牌周边
                        newData = allData.filter((item) => item.productName.match(RegExp(/Smartisan/)))
                    }

                    //判断是否需要排序
                    if (sort) { //1  升序 a<b -1  降序 a>b
                        newData = newData.sort(sortBy('salePrice', sort))
                    }
                    //返回结果
                    res.json({
                        data: newData,
                        total: allData.length
                    })

                })
            })
            app.get('/api/goods/productDet', (req, res) => {
                fs.readFile('./db/goodsDetail.json', 'utf8', (err, data) => {
                    if (!err) {
                        const { result } = JSON.parse(data);
                        const productId = req.query.productId;
                        const newData = result.find(item => item.productId == productId);
                        res.json(newData)
                    }
                })
            })
        }
    }
}