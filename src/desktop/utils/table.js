/**
 * wanjun.feng@hand-china.com
 * 2017/5/27
 */

/**
 * Table插件页码切换方法
 * @param fetch 查询后台数据的function名称
 * @param body 请求参数
 * @param pagination
 * @param filters
 * @param sorter
 */
export function handleTableChange(fetch, body={}, pagination, filters, sorter) {
  //查询排序
  if (sorter.field) {
    const orderByName = sorter.order.substr(0,sorter.order.indexOf("end"));
    if (this.state.orderBy.indexOf(sorter.field+" desc") != -1) {
      this.state.orderBy.splice(this.state.orderBy.indexOf(sorter.field+" desc"),1);
    } else if (this.state.orderBy.indexOf(sorter.field+" asc") != -1) {
      this.state.orderBy.splice(this.state.orderBy.indexOf(sorter.field+" asc"),1);
    }
    this.state.orderBy.splice(0,0,sorter.field+" "+orderByName);
  }

  const pager = { ...this.state.pagination };
  pager.current = pagination.current;
  this.setState({
    pagination: pager,
    orderBy: this.state.orderBy||[],
  });

  body.pagesize = pagination.pageSize;
  body.page = pagination.current;
  body.orderBy = (this.state.orderBy||[]).toString();

  fetch(body).then((data) => {
    pagination.total = data.total;
    for (var i=0; i<data.rows.length; i++) {
      data.rows[i].key = (pagination.current-1)*pagination.pageSize+i;
    }
    this.setState({
      dataList: data.rows,
      pagination
    });
  });
}
