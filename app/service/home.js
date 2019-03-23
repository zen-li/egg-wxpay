const Service = require('egg').Service;

class HomeService extends Service {

  async list(page = 1) {
    // read config
    const { serverUrl, pageSize } = this.config.home;

    // use build-in http client to GET hacker-home api
    const { data: idList } = await this.ctx.curl(`${serverUrl}/topics`, {
      dataType: 'json',
      data: {
        orderBy: '"$key"',
        startAt: `"${pageSize * (page - 1)}"`,
        endAt: `"${pageSize * page - 1}"`,
      },
    });

    // parallel GET detail
    const homeList = await Promise.all(
      Object.keys(idList).map(key => {
        const url = `${serverUrl}/item/${idList[key]}.json`;
        return this.ctx.curl(url, { dataType: 'json' });
      })
    );
    return homeList.map(res => res.data);
  }
}

module.exports = HomeService;
