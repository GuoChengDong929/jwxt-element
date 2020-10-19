<template>
    <div>
        <div style="margin: 20px 5px 10px 5px;padding: 5px;">
			<el-button  size="mini" type="success" @click="openWindow('classesChild',null)" plain> <span class="el-icon-plus"></span> 新增班级</el-button>
		</div>

        <div style="margin: 5px;padding: 5px;">
            <el-table :data="classes">
                <el-table-column type="index" align="center"></el-table-column>
                <el-table-column prop="classesName" label="班级名称" align="center">
                    <template slot-scope="scope">
                        {{scope.row.classesName}} <span style="margin-left:5px" v-if="scope.row.invalid == '0'"><el-tag type="danger" size="mini">作废</el-tag></span>
                    </template>
                </el-table-column>
                <el-table-column prop="curriculumName" label="所属阶段" align="center"></el-table-column>
                <el-table-column prop="startTime" label="开班时间" align="center">
                    <template slot-scope="scope">{{format(scope.row.startTime)}}</template>    
                </el-table-column>
                <el-table-column prop="endTime" label="毕业时间" align="center">
                    <template slot-scope="scope">{{format(scope.row.endTime)}}</template>  
                </el-table-column>
                <el-table-column prop="personNumber" label="班级人数" align="center"></el-table-column>
                <el-table-column prop="teachers" label="带班教师" align="center"></el-table-column>
                <el-table-column label="操作" align="center">

                    <template slot-scope="scope">
                        <el-popover placement="left" width="500" trigger="hover">
                            <div style="text-align:center">
                                <el-button type="success" size="mini" @click="openWindow('classesChild',scope.row)" plain><span class="el-icon-edit"></span>修改</el-button>
                                <el-button type="success" size="mini" plain>结构</el-button>
                                <el-button type="success" size="mini" plain>分班</el-button>
                                <el-button type="success" size="mini" plain>合班</el-button>
                                <el-button type="danger" size="mini" plain @click="invalid(scope.row)"> <span class="el-icon-alarm-clock"></span> 作废</el-button>
                            </div>
                            <el-button slot="reference" size="mini" type="success" plain> <span class="el-icon-scissors"></span> 操作</el-button>
                    </el-popover>
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

        <classes-child ref="classesChild"></classes-child>
    </div>
</template>
<script>

    import { list,invalid } from "@/api/quality/transact/classes.js"
    import { YearMonthDay } from '@/utils/tools.js'


    export default {
        name: 'classes-index',
        components:{
            ClassesChild:()=>import("@/views/quality/transact/classes-child.vue")
        },
        data(){
            return {
                miniValue: false,
                classes:[],
                params:{page:1,size:10,total:0}
            }
        },
        methods:{
            openWindow(name,data){
                if(data  == null){
                    this.$refs[name].classes = {};
                    this.$refs[name].value = true;
                }else{
                    if(data.invalid == '0'){
                        this.$message.error("作废的班级无法操作");
                        return false;
                    }else{
                        this.$refs[name].classes = data;
                        this.$refs[name].value = true;
                    }
                    
                }
                
            },
            format(date){
                return YearMonthDay(date);
            },
            handleSizeChange(val){
                this.params.size = val;
                this.getClassesList(this.params);
            },
            handlePageChange(val){
                this.params.page = val;
                this.getClassesList(this.params);
            },
            getClassesList(data){
                list(data).then(res=>{
                    if(res.data.success){
                        this.classes = res.data.data.rows;
                        this.params.total = res.data.data.total;
                    }
                });
            },
            invalid(data){ //作废班级

                if(data.invalid == '0'){
                    this.$message.error("作废的班级无法操作");
                    return false;
                }

                this.$confirm("确定要作废该班级吗?","友情提示",{type:'warning'}).then(()=>{
                    invalid({classesId:data.id}).then(res=>{
                        this.$message({
                            type:res.data.success ? 'success' :'error',
                            message:res.data.message
                        });
                        this.getClassesList(this.params);
                    });
                });
            }
        },
        created(){
            this.getClassesList(this.params);
        }
    }
</script>
<style>

</style>