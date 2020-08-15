import Vue from 'vue';
import Swal from 'sweetalert2';

import { defaultData as defaultPVData, PVData } from './modules/PVData';

import Drag from '../icons/drag.svg';
import Play from '../icons/play.svg';

import '../scss/index.scss';

new Vue({
    components: {
        Drag,
        Play
    },
    el: "#app",
    data: {
        pvData: <PVData>null
    },
    methods: {
        exploreFile() {
            this.$refs.fileSelector.click();
        },
        dragHandler(e : DragEvent) {
            e.preventDefault();
            let files = e.dataTransfer.files;
            if (files.length == 0) {
                return false;
            }
            this.fileSelected(files[0]);
        },
        fileSelected(f: File) {
            let file : File = f == undefined ? this.$refs.fileSelector.files[0] : f;
            if (file) {
                let spl = file.name.split(".");
                let ext = spl.pop();
                if (ext != "qpv") {
                    Swal.fire("文件无效", "你选择的文件不是qpv文件", "error");
                    return;
                }
                let reader = new FileReader();
                reader.readAsBinaryString(file);
                reader.onloadend = () => {
                    // TODO: Verify if file content is valid
                    try {
                        this.pvData = JSON.parse(reader.result.toString());
                    } catch {
                        Swal.fire("文件无效", "转换失败", "error");
                    }
                }
            }
        },
        startNew() {
            this.pvData = defaultPVData;
        }
    }
});