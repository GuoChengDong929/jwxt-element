<template>
    <div>
        <div style="margin: 20px 5px 10px 5px;padding: 5px;">
			<el-button plain size="mini" type="success" @click="openWindow('child',null)"> <span class="el-icon-plus"></span> 新增字典信息</el-button>
		</div>
        <div style="margin: 5px;padding: 5px;">
            <el-table :data="data">
                <el-table-column type="index" align="center"></el-table-column>
                <el-table-column prop="name" label="字段名称" align="center"></el-table-column>
                <el-table-column prop="code" label="字段代码" align="center"></el-table-column>
                <el-table-column prop="useScenarios" label="使用场景" align="center"></el-table-column>
                <el-table-column prop="description" label="字段描述" align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button plain size="mini" type="success" @click="openWindow('child',scope.row)"><span class="el-icon-edit"></span>修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div style="margin: 5px;padding: 5px;text-align:center">
            <el-pagination background
			 layout="prev,pager,next" 
			 :total="params.total" 
			 :page-size="params.size" 
			 :current-page="params.page" 
			 :hide-on-single-page="false"
			 @size-change="handleSizeChange"
			 @current-change="handlePageChange"></el-pagination>
        </div>
        <child ref="child"></child>
    </div>
</template>
<script>

    import { list } from '@/api/system/dictionaries.js'

    export default {
        name:'dictionaries-index',
        components:{
            Child:()=>import("@/views/system/dictionaries/child.vue")
        },
        data(){
            return {
                data:[],
                params:{page:1,size:10,total:0}
            }
        },
        methods:{
            openWindow(name,data){
                if(data == null){
                    this.$refs[name].dictionaries = {};
                }else{
                    this.$refs[name].dictionaries = data;
                }
                this.$refs[name].value = true;
            },
            handleSizeChange(val){
                this.params.size =val;
                this.list(this.params);
            },
            handlePageChange(val){
                this.params.page = val;
                this.list(this.params);
            },
            getDictionariesList(data){
                list(data).then(res=>{
                    if(res.data.success){
                        this.data = res.data.data.rows;
                        this.params = res.data.data.total;
                    }
                });
            }
        },
        created(){
            this.getDictionariesList(this.params);
        }
    }
</script>
<style scoped>

</style>