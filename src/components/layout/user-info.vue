<template>
    <div>
        <el-dialog :visible.sync="value" :title="'【'+ data.nickName + '】的用户信息'">
            <el-form ref="form" :model="params"  label-width="150px" label-position="right" :rules="rules">
                <el-form-item prop="nickName" label="用户姓名" >
                    <p style="color: #99a9bf">{{data.nickName}}</p>
                </el-form-item>
                <el-form-item prop="oldPassword" label="旧密码">
                    <el-input v-model="params.oldPassword"></el-input>
                </el-form-item>
                <el-form-item prop="newPassword" label="新密码">
                    <el-input v-model="params.newPassword"></el-input>
                </el-form-item>
                <el-form-item prop="againNewPassword" label="确认新密码">
                    <el-input v-model="params.againNewPassword"></el-input>
                </el-form-item>
            </el-form>
            <template slot="footer">
                <el-button type="danger" plain @click="handleSubmit" v-loading.fullscreen.lock="fullscreenLoading">修改密码</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>


    import { findUserInfo,updatePassword } from "@/api/access/user";
    import { mapActions } from 'vuex'
    export default {
        name: "user-info",
        data(){
            return {
                fullscreenLoading:false,
                value : false,
                data:{},
                params:{oldPassword:'',newPassword:'',againNewPassword:""}
            }
        },
        watch:{
            value(data){
                findUserInfo().then(res=>{
                    if(res.data.success){
                        this.data = res.data.data;
                    }
                });
            }
        },
        computed:{
            rules(){
                return {
                    oldPassword: this.oldPasswordRule,
                    newPassword: this.newPasswordRule,
                    againNewPassword: this.againNewPasswordRule
                }
            }
        },
        methods:{
            ...mapActions([
                'logout'
            ]),
            handleSubmit(){
                this.$refs['form'].validate(valid=>{
                    if(valid){


                        if(this.params.newPassword != this.params.againNewPassword){
                            this.$message.error("两次密码输入不一致");
                            return false;
                        }


                        this.fullscreenLoading = true;
                        this.$confirm("确定要修改密码吗?","友情提示",{type:'warning'}).then(()=>{
                            updatePassword(this.params).then(res=>{
                                this.logout().then(()=>{
                                    this.$message({
                                        type:res.data.success ? 'success' : "error",
                                        message:res.data.message,
                                        center:true
                                    });
                                    this.value = false;
                                    this.fullscreenLoading = false;
                                    window.location.reload();
                                })
                            })
                        });

                    }else{
                        return false;
                    }
                });
            }
        },
        props:{
            oldPasswordRule:{
                type:Array,
                default:()=>{
                    return [
                        {required:true,message:'必填项',trigger:'blur'}
                    ]
                }
            },
            newPasswordRule:{
                type:Array,
                default:()=>{
                    return [
                        {required:true,message:'必填项',trigger:'blur'}
                    ]
                }
            },
            againNewPasswordRule:{
                type:Array,
                default:()=>{
                    return [
                        {required:true,message:'必填项',trigger:'blur'}
                    ]
                }
            }
        }
    }
</script>

<style scoped>

</style>