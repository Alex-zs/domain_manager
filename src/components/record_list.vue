<template>
  <div>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="1" @click="refreshRecords">解析列表</el-menu-item>
      <el-menu-item index="2">操作日志</el-menu-item>
      <el-menu-item index="3" @click="dialogVisible = true">添加记录</el-menu-item>
    </el-menu>
    <div class="line"></div>
    <el-table
        :data="tableData"
        stripe
        border
        style="width: 100%">
      <el-table-column
          prop="id"
          label="ID"
          width="180">
      </el-table-column>
      <el-table-column
          prop="type"
          label="记录类型"
          width="100">
      </el-table-column>
      <el-table-column
          prop="rr"
          label="主机记录"
          width="200">
      </el-table-column>
      <el-table-column
          prop="value"
          label="记录值">
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
        title="添加记录"
        :visible.sync="dialogVisible"
        width="30%"
        >

      <el-form>
        <el-form-item label="记录类型">
          <el-select placeholder="请选择记录类型" v-model="form.type">
            <el-option label="IPv4" value="A"></el-option>
            <el-option label="IPv6" value="AAAA"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主机记录">
          <el-input v-model="form.rr"></el-input>
          <span>.itstudio.club</span>

          <el-tooltip placement="top" effect="light">
            <div slot="content">主机记录就是域名前缀，常见用法有：
              <br/>
              <br/>
              www：解析后的域名为www.itstudio.club。
              <br/>
              <br/>
              @：直接解析主域名 itstudio.club。
              <br/>
              <br/>
              *：泛解析，匹配其他所有域名 *.itstudio.club。
              <br/>
              <br/>
              二级域名：如：abc.aliyun.com，填写abc。
            </div>
            <i class="el-icon-question"></i>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="记录值">
         <el-input v-model="form.value"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRecord">确 定</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script>
let URL = "https://itstudio.club/domain/record"
export default {
  name: "record_list",
  data() {
    return {
      activeIndex: '1',
      dialogVisible: false,
      tableData:
          [{"id":"19592154515783680","type":"TXT","rr":"_dnsauth","value":"2020042400000057wmu0w03goc7qlakmzdt9xfla6vfowffzpvniy460qwq5tinc"},{"id":"19592129276234752","type":"TXT","rr":"_dnsauth","value":"202004240000002q2yxz68jo5j87dzbx90yz2agpvxdjf9wufk0lgow380p0t693"},{"id":"18757145175284736","type":"A","rr":"tianyu","value":"121.41.224.194"},{"id":"18757126319003648","type":"A","rr":"*.inner.tianyu","value":"121.41.224.194"},{"id":"18076921065979904","type":"A","rr":"@","value":"47.102.147.20"},{"id":"17917358102558720","type":"MX","rr":"@","value":"mxbiz2.qq.com"},{"id":"17917357323532288","type":"MX","rr":"@","value":"mxbiz1.qq.com"},{"id":"17764139655654400","type":"A","rr":"www","value":"39.96.208.176"},{"id":"17696336163595264","type":"TXT","rr":"_dnsauth","value":"201905250000000837d5krl1r5bj2ditug0dv1fio2x8r2yz8h7miku9r21p7uav"},{"id":"17623889935426560","type":"CNAME","rr":"dmtrace","value":"tracedm.aliyuncs.com"},{"id":"17623887071568896","type":"TXT","rr":"@","value":"v=spf1 include:spf.mail.qq.com ~all"},{"id":"17623885630302208","type":"TXT","rr":"aliyundm","value":"2e1f43b10de24bfca6da"}],
      form: {
        type: '',
        rr: '',
        value:'',
      }
    }
  },
  methods: {
    getRecords() {
      this.$http.get(URL).then((res) => {
        if (res.data.status === 1) {
          this.tableData = res.data.data;
        } else {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: 'warning'
          });
        }
      });
    },
    refreshRecords() {
      this.getRecords();
    },
    handleDelete(index, row) {
      let recordID = row.id;
      this.$confirm('确定删除ID为<' + recordID + ">的记录", '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(URL + "?recordID=" + recordID).then((res) => {
          if (res.data.status === 1) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.refreshRecords();
          }else {
            this.$message({
              type: 'warning',
              message: '删除失败!'
            });
          }
        })

      });
    },
    addRecord() {
      if(this.validForm()) {
        this.$http.post(URL, this.form).then((res) => {
          if (res.data.status === 1) {
            this.$message({
              type: 'success',
              message: '添加成功'
            });
            this.dialogVisible = false;
            this.refreshRecords();
          }else {
            this.$message({
              type: 'warning',
              message: '添加失败'
            });
          }
        })
      }
    },
    validForm() {
      if (this.form.type.length === 0 || this.form.rr.length === 0
          || this.form.value.length === 0) {
        this.$message({
          type: 'warning',
          message: '请填写完整信息'
        });
        return false;
      }

      if (this.form.type === 'A') {
        return this.testIPv4(this.form.value);
      }else if (this.form.type === 'AAAA') {
        return this.testIPv6(this.form.value);
      }
      return true;
    },
    testIPv4(ipv4) {
      let e = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/
      if (e.test(ipv4)) {
        return true;
      }else {
        this.$message({
          type: 'warning',
          message: 'IPv4记录值格式错误'
        });
        return false;
      }
    },
    testIPv6(ipv6) {
      let e = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/
      if (e.test(ipv6)) {
        return true;
      }else {
        this.$message({
          type: 'warning',
          message: 'IPv6记录值格式错误'
        });
        return false;
      }
    }
  },
  mounted() {
    this.getRecords();
    document.body.style.backgroundColor = '#eeeeee'
  }
}
</script>


<style scoped>

</style>
