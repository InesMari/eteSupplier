import { LPAPIFactory } from "../../../utils/lpapi-ble/index";

Page({
    data: {
        canvasId: "print-canvas",
        waybillNum: "",
        deviceList: [{ name: "未检测到打印机", deviceId: "" }],
        deviceIndex: 0,
        isPrinterConnected: false,
        isConnecting: false,
        isPrinting: false,
        previewImage: "",
    },

    onLoad(options) {
        let {waybillId,waybillNum} = options;
        this.setData({ waybillNum,waybillId });
    },

    onReady() {
        console.log('========= onReady =========');
        this.initApi();
        // 页面准备好后自动搜索并连接打印机
        this.autoSearchAndConnect();
        // 页面准备好后自动生成预览
        if (this.data.waybillNum) {
            this.generatePreview();
        }
    },

    onHide() {
        // 页面隐藏时关闭打印机连接
        this.closePrinter();
    },

    onUnload() {
        // 页面卸载时关闭打印机连接
        this.closePrinter();
    },

    // 初始化打印机API
    initApi() {
        this.lpapi = LPAPIFactory.getInstance({
            showLog: 4,
            canvasId: this.data.canvasId,
        });
    },

    // 检测到打印机设备
    onDeviceFound(devices) {
        console.log('onDeviceFound - 检测到打印机:', devices);
        if (devices && devices.length > 0) {
            console.log('onDeviceFound - 设备数量:', devices.length);
            this.setData({
                deviceList: devices,
                deviceIndex: 0,
            });
            // 找到设备后，自动连接第一个设备
            if (this.data.isConnecting) {
                wx.showToast({
                    title: "找到打印机，正在连接...",
                    icon: "loading",
                    duration: 1500
                });
                this.connectPrinter();
            }
        }
    },

    // 打印机选择改变
    onDeviceChanged(e) {
        console.log('onDeviceChanged - 打印机选择改变:', e.detail.value);
        this.setData({
            deviceIndex: e.detail.value,
            isPrinterConnected: false,
        });
    },

    // 切换打印机连接状态（包装方法）
    togglePrinterConnection() {
        console.log('togglePrinterConnection - 切换连接状态, 当前状态:', this.data.isPrinterConnected);
        if (this.data.isPrinterConnected) {
            this.closePrinter();
        } else {
            this.searchAndConnectPrinter();
        }
    },

    // 搜索并连接打印机（手动触发）
    searchAndConnectPrinter() {
        if (this.data.isConnecting) {
            return;
        }

        console.log('searchAndConnectPrinter - 开始搜索并连接打印机');
        this.setData({ isConnecting: true });

        wx.showLoading({
            title: "正在搜索打印机...",
        });

        this.lpapi.startBleDiscovery({
            timeout: 8000,
            deviceFound: (devices) => {
                this.onDeviceFound(devices);
            },
            adapterStateChange: (result) => {
                console.log('searchAndConnectPrinter - 蓝牙适配器状态变化:', result);
                if (!result.discovering && !this.data.isPrinterConnected) {
                    wx.hideLoading();
                    this.setData({ isConnecting: false });
                    if (this.data.deviceList.length > 1 || (this.data.deviceList.length === 1 && this.data.deviceList[0].deviceId)) {
                        wx.showToast({
                            title: "搜索成功，请选择设备",
                            icon: "none",
                            duration: 2000
                        });
                    } else {
                        wx.showToast({
                            title: "未找到打印机",
                            icon: "none",
                            duration: 2000
                        });
                    }
                }
            },
            fail: (err) => {
                console.error('searchAndConnectPrinter - 搜索失败:', err);
                wx.hideLoading();
                this.setData({ isConnecting: false });
                wx.showToast({
                    title: "搜索打印机失败，请检查打印机是否已开机，手机蓝牙是否已开启。",
                    icon: "error",
                    duration: 2000
                });
            },
        });
    },

    // 自动搜索并连接打印机（页面加载时调用）
    autoSearchAndConnect() {
        console.log('autoSearchAndConnect - 自动搜索并连接打印机');
        this.setData({ isConnecting: true });

        // 显示搜索提示
        wx.showToast({
            title: "正在搜索打印机...",
            icon: "loading",
            duration: 2000
        });

        this.lpapi.startBleDiscovery({
            timeout: 10000,
            deviceFound: (devices) => {
                console.log('autoSearchAndConnect - 发现设备:', devices);
                this.onDeviceFound(devices);
            },
            adapterStateChange: (result) => {
                console.log('autoSearchAndConnect - 蓝牙适配器状态变化:', result);
                if (!result.discovering) {
                    console.log('autoSearchAndConnect - 搜索完成');
                    if (this.data.isPrinterConnected) {
                        // 已连接成功
                        console.log('autoSearchAndConnect - 打印机已连接');
                        wx.showToast({
                            title: "打印机已连接",
                            icon: "success",
                            duration: 1500
                        });
                    } else if (this.data.deviceList.length > 1 || (this.data.deviceList.length === 1 && this.data.deviceList[0].deviceId)) {
                        // 找到设备但未连接，显示提示
                        this.setData({ isConnecting: false });
                        wx.showToast({
                            title: "找到打印机，正在连接...",
                            icon: "none",
                            duration: 1500
                        });
                    } else {
                        // 未找到设备
                        this.setData({ isConnecting: false });
                        wx.showToast({
                            title: "未找到打印机",
                            icon: "none",
                            duration: 2000
                        });
                    }
                }
            },
            fail: (err) => {
                console.error('autoSearchAndConnect - 搜索失败:', err);
                this.setData({ isConnecting: false });
                wx.showToast({
                    title: "搜索打印机失败，请检查打印机是否已开机，手机蓝牙是否已开启。",
                    icon: "error",
                    duration: 2000
                });
            },
        });
    },

    // 连接打印机
    connectPrinter() {
        const currDevice = this.data.deviceList[this.data.deviceIndex];
        console.log('connectPrinter - 当前选择设备:', currDevice);

        if (!currDevice || !currDevice.deviceId) {
            console.warn('connectPrinter - 未选择有效设备');
            wx.showToast({ title: "请先选择打印机", icon: "none" });
            this.setData({ isConnecting: false });
            return;
        }

        if (!currDevice.deviceId || currDevice.deviceId === "") {
            console.warn('connectPrinter - 设备ID为空');
            wx.showToast({ title: "请先搜索并选择打印机", icon: "none" });
            this.setData({ isConnecting: false });
            return;
        }

        // 显示连接中的提示
        wx.showToast({
            title: "正在连接打印机...",
            icon: "loading",
            duration: 3000
        });

        console.log('connectPrinter - 调用openPrinter, deviceId:', currDevice.deviceId);

        this.lpapi.openPrinter({
            name: currDevice.name,
            deviceId: currDevice.deviceId,
            success: (resp) => {
                console.log('connectPrinter - 打印机连接成功:', resp);
                wx.showToast({
                    title: "打印机连接成功",
                    icon: "success",
                    duration: 1500
                });
                this.setData({
                    isPrinterConnected: true,
                    isConnecting: false
                });
            },
            fail: (resp) => {
                console.warn('connectPrinter - 打印机连接失败:', resp);
                console.warn('connectPrinter - 失败详情:', JSON.stringify(resp));
                wx.showToast({
                    title: resp.errMsg || "连接失败",
                    icon: "error",
                    duration: 2000
                });
                this.setData({
                    isPrinterConnected: false,
                    isConnecting: false
                });
            },
        });
    },

    // 断开打印机连接
    closePrinter() {
        console.log('关闭打印机');
        this.lpapi.closePrinter();
        this.setData({ isPrinterConnected: false });
    },

    // 打印二维码
    printQrcode() {
        if (!this.data.waybillNum) {
            wx.showToast({ title: "运单号不能为空", icon: "none" });
            return;
        }

        if (!this.data.isPrinterConnected) {
            wx.showToast({ title: "请先连接打印机", icon: "none" });
            return;
        }

        if (this.data.isPrinting) {
            wx.showToast({ title: "正在打印中...", icon: "none" });
            return;
        }

        this.setData({ isPrinting: true });
        wx.showLoading({ title: "正在打印..." });

        const api = this.lpapi;
        const labelWidth = 40;
        const labelHeight = 30;
        const margin = 2;
        const textHeight = 4;
        const codeWidth = labelHeight - margin * 2 - textHeight;
        const {waybillNum,waybillId} = this.data;

        // 创建打印任务 - 添加 orientation: 0 确保横向打印
        api.startJob({
            width: labelWidth,
            height: labelHeight,
            orientation: 0,
            jobName: "lpapi-ble",
        });

        // 绘制二维码
        api.draw2DQRCode({
            text: waybillId,
            x: (labelWidth - codeWidth) * 0.5,
            y: margin,
            width: codeWidth,
        });

        // 在二维码底部绘制运单号文本
        api.drawText({
            text: waybillNum,
            x: 0,
            y: margin + codeWidth,
            width: labelWidth,
            height: textHeight,
            fontHeight: 3.5,
            horizontalAlignment: 1,
        });

        // 提交打印任务
        api.commitJob({
            gapType: 2,
            darkness: 10,
        }).then((resp) => {
            wx.hideLoading();
            this.setData({ isPrinting: false });

            if (resp.statusCode === 0) {
                wx.showToast({ title: "打印成功", icon: "success" });
            } else {
                wx.showToast({ title: "打印失败", icon: "error" });
                console.warn('打印失败:', resp);
            }
        }).catch(() => {
            wx.hideLoading();
            this.setData({ isPrinting: false });
            wx.showToast({ title: "打印异常", icon: "error" });
        });
    },

    // 生成预览
    generatePreview() {
        if (!this.data.waybillNum) {
            return;
        }

        const api = this.lpapi;
        const labelWidth = 40;
        const labelHeight = 30;
        const margin = 2;
        const textHeight = 4;
        const codeWidth = labelHeight - margin * 2 - textHeight;
        const {waybillNum,waybillId} = this.data;

        console.log('generatePreview - 开始生成预览, waybillId:', waybillId);

        // 创建打印任务 - 添加 orientation: 0 确保横向打印
        api.startJob({
            width: labelWidth,
            height: labelHeight,
            orientation: 0,
            jobName: "#!#preview#!#",
        });

        api.draw2DQRCode({
            text: waybillId,
            x: (labelWidth - codeWidth) * 0.5,
            y: margin,
            width: codeWidth,
        });

        api.drawText({
            text: waybillNum,
            x: 0,
            y: margin + codeWidth,
            width: labelWidth,
            height: textHeight,
            fontHeight: 3.5,
            horizontalAlignment: 1,
        });

        api.commitJob({
            gapType: 2,
            darkness: 10,
        }).then((resp) => {
            console.log('generatePreview - 预览生成响应:', resp);

            if (resp.statusCode === 0 && resp.dataUrls && resp.dataUrls.length > 0) {
                console.log('generatePreview - 预览生成成功');
                this.setData({
                    previewImage: resp.dataUrls[0],
                });
            } else {
                console.warn('generatePreview - 预览生成失败, resp:', resp);
                wx.showToast({
                    title: '预览生成失败',
                    icon: 'none',
                    duration: 2000
                });
            }
        }).catch((err) => {
            console.error('generatePreview - 预览生成异常:', err);
            wx.showToast({
                title: '预览生成异常',
                icon: 'none',
                duration: 2000
            });
        });
    },

    // 查看预览大图
    previewFullImage() {
        if (this.data.previewImage) {
            wx.previewImage({
                urls: [this.data.previewImage],
                current: this.data.previewImage,
            });
        }
    },

    // 复制运单号
    copyWaybillNum() {
        if (this.data.waybillNum) {
            wx.setClipboardData({
                data: this.data.waybillNum,
                success: () => {
                    wx.showToast({ title: "已复制", icon: "success" });
                },
            });
        }
    },
});
