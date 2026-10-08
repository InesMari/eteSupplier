import {util,wxApi,common,regeneratorRuntime} from '../../../common/commonImport'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{},
    bankIndex:null,
    commitmentChecked:false,
    showCommitment:false,
    credentialNumber:"",  //身份证
    isIndividual:false,   //是否个体供应商
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad() {
    let {BANK_DEPOSIT} = await util.postByBeanName('commonTF','getSysStaticDataByCodeTypes',{codeType:"BANK_DEPOSIT"});
    let {credentialNumber} = await util.postByBeanName('supplierTF','getSupplierDetailInfoMini');
    this.setData({bankList:BANK_DEPOSIT,credentialNumber})
    // 判断是否个体供应商
    let supplierTypeById = await util.postByBeanName('supplierTF','getSupplierTypeById');
    if(supplierTypeById=="Y"){
      // 个体供应商只能对私账户
      this.setData({isIndividual:true,['info.bankType']:'2'})
    }
  },
  async afterRead(event) {
    wx.showLoading();
    const { file } = event.detail;
    let {data} = await util.uploadFile(file);
    wx.hideLoading();
    data = JSON.parse(data);  //数据转化
    console.log(data);
    this.data.idCardFrontList = [{...file,url:common.getBigImgPath(data.content.fullPath)}]
    this.setData({cardFullPath:data.content.storePath,idCardFrontList:this.data.idCardFrontList});
    this.checkImg();
  },
  
  /**
   * 识别图片
   */
  async checkImg(){
    wx.showLoading({title: '正在识别银行卡信息'})
    let {bankCardNumber,bankName} = await util.postByBeanName('bankTF','getBankCardInfoOCR',{fileId:this.data.cardFullPath},null,null,null,false);
    this.data.bankList.forEach((el,index)=>{
      if(bankName.indexOf(el.codeName)>-1||el.codeName.indexOf(bankName)>-1){
        this.setData({['info.bankDeposit']:el.codeValue});
        if(common.isNotBlank(bankName)) this.setData({bankIndex:index})
      }
    })
    this.setData({['info.bankCard']:bankCardNumber.replace(/\s/g,"")});
    wx.hideLoading();
  },
  // 删除图片
  deleteImg(){
    this.setData({cardFullPath:'',idCardFrontList:[]});
  },
  //vantui - input赋值
  inputSetData(e){
    let value = e.detail;
    let { key } = e.currentTarget.dataset;
    this.data.info[key] = value;
    this.setData({ info: this.data.info });
  },  
  // 选择银行
  bankChange(e){
    let { value } = e.detail;
    this.setData({
      "info.bankDeposit": this.data.bankList[value].codeValue,
      bankIndex: value
    })
  },
  // 选择银行卡类型
  radioChange(e){
    this.setData({['info.bankType']:e.detail})
  },
  // 绑定银行卡
  async save(){
    if(this.data.info.bankAccountName!=this.data.tenantName&&this.data.info.bankType==2&&!this.data.commitmentChecked){
      wxApi.showToast('请勾选同意承诺函');
    }
    await util.postByBeanName('bankTF','addBankInfo',this.data.info);
    await wxApi.showModal('绑定成功');
    wx.navigateBack({
      delta: 1,
    })
  },
  // 检测身份是否存在
  checkCard(){
    if(this.data.info.userPayeeCard != this.data.credentialNumber) this.setData({showCommitment:true})
  },
  changCommitmente(e){
    this.setData({
      commitmentChecked: e.detail,
    });
  },
  tocommitment(){
    wx.navigateTo({
      url: '../commitment/commitment',
    })
  }
})