<template>
    <div style="height: 85vh;margin: 20px 5px 10px 5px;padding: 5px">

       <div style="height: 7vh">
           <el-input type="text" placeholder="请输入操作人" v-model="params.username" style="width: 250px;margin-right: 10px"></el-input>
           <el-input type="text" placeholder="请输入操作描述" v-model="params.operation" style="width: 250px;margin-right: 10px"></el-input>
           <el-button type="success" plain @click="params={page:1,size:10,total:0,username:'',operation:''},getLogList(params)"><i style="margin-right: 5px" class="el-icon-refresh"></i>重置</el-button>
       </div>
       <div style="height: 78vh">
           <el-table style="margin: 10px" :data="data" :loading="loading">
               <el-table-column type="index" align="center" label="序号" width="80px"></el-table-column>
               <el-table-column prop="username" label="操作人" align="center"></el-table-column>
               <el-table-column prop="operation" label="操作描述" align="center"></el-table-column>
               <el-table-column prop="time" label="耗时" align="center">
                   <template slot-scope="scope">
                       {{scope.row.time / 1000}} s
                   </template>
               </el-table-column>
               <el-table-column prop="method" label="触发方法" show-overflow-tooltip align="center"></el-table-column>
               <el-table-column prop="params" label="请求参数" show-overflow-tooltip align="center"></el-table-column>
               <el-table-column prop="ip" label="操作人IP地址" align="center"></el-table-column>
               <el-table-column prop="createTime" label="操作时间" align="center">
                   <template slot-scope="scope">
                       {{formatDate(scope.row.createTime)}}
                   </template>
               </el-table-column>
           </el-table>
           <el-pagination background
                          layout="prev,pager,next"
                          :total="params.total"
                          :page-size="params.size"
                          :current-page="params.page"
                          :hide-on-single-page="false"
                          @size-change="handleSizeChange"
                          @current-change="handlePageChange"></el-pagination>
       </div>


    </div>
</template>

<script>

    import { formatDateNoWeek } from "@/utils/tools";

    import { getLogList } from "@/api/log/operation-log";
    import Index from "../quartz/index";

    export default {
        name: "log-index",
        components: {Index},
        data(){
            return {
                loading:true,
                data:[],
                params:{page:1,size:10,total:0,username:'',operation:""}
            }
        },
        methods:{
            formatDate(date){
                return formatDateNoWeek(date);
            },
            handleSizeChange(val){
                this.params.size = val;
                this.getLogList(this.params);
            },
            handlePageChange(val){
                this.params.page = val;
                this.getLogList(this.params);
            },
            getLogList(data){
                getLogList(data).then(res=>{
                    if(res.data.success){
                        this.data = res.data.data.rows;
                        this.params.total = res.data.data.total;
                        this.loading = false;
                    }
                });
            }
        },
        watch:{
          'params.username'(data){
              if(data){
                  this.getLogList(this.params);
              }
          },
          'params.operation'(data){
              if(data){
                  this.getLogList(this.params);
              }
          }
        },
        created() {
            this.getLogList(this.params);
        }
    }
</script>

<style scoped>

</style>