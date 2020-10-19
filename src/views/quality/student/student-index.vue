<template>
    <div>

        <div style="margin: 20px 5px 10px 5px;padding: 5px;">

            <el-radio-group v-model="params.classesId" size="mini" fill="#67C23A"  @change="radioChange">
                <el-radio-button :label="item.id"  :key="item.id" v-for="item in classesData" border>{{item.classesName}}</el-radio-button>
            </el-radio-group>

            <el-input v-model="params.nickName" size="mini" type="text" placeholder="请输入学生姓名" style="margin: 0px 10px 0px 10px;width: 200px"></el-input>
            <el-button plain type="info" size="mini" @click="params.nickName='',getStudentList(params)">重置</el-button>

			<el-button plain style="float:right" size="mini" type="success" @click="openWindow('studentChild',null)"> <span class="el-icon-plus"></span> 新增学生</el-button>
		</div>

        <div style="margin: 5px;padding: 5px;">
            <el-table :data="studentData" size="mini" v-loading="loading" element-loading-text="玩了命的加载...." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
                <el-table-column type="expand">
                    <template slot-scope="scope">

                       <div style="text-align:left">
                            <el-row>
                                <el-col style="margin-top: 10px" :span="6">级别: {{scope.row.level}}</el-col>
                                <el-col style="margin-top: 10px" :span="6">用户名: {{scope.row.username}}</el-col>
                                <el-col style="margin-top: 10px" :span="6">密码: {{scope.row.password}}</el-col>
                                <el-col style="margin-top: 10px" :span="6">邮箱: {{scope.row.email}}</el-col>
                            </el-row>

                             <el-row>
                                <el-col style="margin-top: 10px" :span="6">户籍: {{scope.row.residenceAddress}}</el-col>
                                <el-col style="margin-top: 10px" :span="6">现居住地: {{scope.row.nowAddress}}</el-col>
                                <el-col style="margin-top: 10px" :span="6">身份证号: {{scope.row.idCard}}</el-col>
                                <el-col style="margin-top: 10px" :span="6">生日: {{format(scope.row.birthday)}}</el-col>
                            </el-row>

                            <el-row>
                                <el-col style="margin-top: 10px" :span="6">学历: {{scope.row.education}}</el-col>
                                <el-col style="margin-top: 10px" :span="6">毕业院校: {{scope.row.graduationSchool}}</el-col>
                                <el-col style="margin-top: 10px" :span="6">紧急联络人: {{scope.row.emergencyContact}}</el-col>
                                <el-col style="margin-top: 10px" :span="6">紧急联络人关系及电话: {{scope.row.relation}}</el-col>
                            </el-row>

                            <el-row>
                                <el-col style="margin-top: 10px" :span="6">相关专业: {{scope.row.major == '1' ? '计算机专业' : '其他专业'}}</el-col>
                                <el-col v-if="scope.row.studyType == '2'" style="margin-top: 10px" :span="6">休学时间: {{format(scope.row.stopStudyTime)}}</el-col>
                                <el-col v-if="scope.row.studyType == '2'" style="margin-top: 10px" :span="6">休学时长: {{scope.row.stopStudyLength}}天</el-col>
                                <el-col v-if="scope.row.studyType == '2'" style="margin-top: 10px" :span="6">休学原因: {{scope.row.stopStudyReason}}</el-col>
                            </el-row>

                            <el-row>
                                <el-col v-if="scope.row.studyType == '3'" style="margin-top: 10px" :span="6">退学时间: {{format(scope.row.backStudyTime)}}</el-col>
                                <el-col v-if="scope.row.studyType == '3'" style="margin-top: 10px" :span="6">退学原因: {{scope.row.backStudyReason}}</el-col>
                                <el-col v-if="scope.row.studyType == '4'" style="margin-top: 10px" :span="6">毕业时间: {{format(scope.row.finishStudyTime)}}</el-col>
                                
                            </el-row>

                             <el-row>
                                <el-col style="margin-top: 10px" :span="6">是否禁用: {{scope.row.status == '0' ? '禁用' : '启用'}}</el-col>
                                <el-col style="margin-top: 10px" :span="6">学习状态: {{scope.row.studyType == '1' ?  '在读' : (scope.row.studyType == '2' ? '休学' :(scope.row.studyType == '3' ? '退学' : '毕业'))}}</el-col>
                            </el-row>
                       </div>
                    </template>    
                </el-table-column>
                <el-table-column prop="nickName" label="姓名" align="center"></el-table-column>
                <el-table-column prop="telephone" label="电话"  align="center"></el-table-column>
                <el-table-column prop="sex" label="性别"  align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.sex == '1' ? '男' : '女' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="classesName" label="所在班级"  align="center"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-popover placement="left" width="500" style="height:300px" trigger="hover">
                            <div style="text-align:center">
                                <el-button size="mini" type="success" plain @click="openWindow('studentChild',scope.row)"><span class="el-icon-edit"></span>修改</el-button>
                            </div>
                            <el-button slot="reference" size="mini" type="success" plain><span class="el-icon-scissors"></span> 操作</el-button>
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
			 :hide-on-single-page="true"
			 @size-change="handleSizeChange"
			 @current-change="handlePageChange"></el-pagination>
        </div>


        <student-child ref="studentChild"></student-child>
    </div>
</template>
<script>

    import { list } from '@/api/quality/student/student.js'

    import { findAll } from '@/api/quality/transact/classes.js'

    import { YearMonthDay } from '@/utils/tools.js'

    export default {
        name:'student-index',
        components:{
            StudentChild:()=>import("@/views/quality/student/student-child.vue")
        },
        data(){
            return {
                loading:false,
                studentData:[],
                classesData:[],
                params:{page:1,size:10,total:0,classesId:'',nickName:''}
            }
        },
        watch:{
          'params.nickName'(data){
              if(data){
                  this.getStudentList(this.params);
              }
          }
        },
        methods:{
            format(date){
                return YearMonthDay(date);
            },
            radioChange(val){
                this.params.classesId = val;
                this.getStudentList(this.params);
            },
            handleSizeChange(val){
                this.params.size = val;
                this.getStudentList(this.params);
            },
            handlePageChange(val){
                this.params.page = val;
                this.getStudentList(this.params);
            },
            getStudentList(data){
                this.loading = true;
                list(data).then(res=>{
                    if(res.data.success){
                        this.studentData = res.data.data.rows;
                        this.params.total = res.data.data.total;
                        this.loading = false;
                    }
                });
            },
            openWindow(name,data){
                if(data == null){
                    this.$refs[name].student = {};
                }else{
                    this.$refs[name].student = data;
                }
                this.$refs[name].value = true;
            }
        },
        created(){
            findAll().then(res=>{
                if(res.data.success){
                    if(res.data.data && res.data.data.length > 0){
                        this.classesData = res.data.data;
                    }
                }
            });



            //this.getStudentList(this.params);
        }
    }
</script>
<style scoped>
    /* div > el-row > el-col {
        margin-top: '30px'
    } */
</style>