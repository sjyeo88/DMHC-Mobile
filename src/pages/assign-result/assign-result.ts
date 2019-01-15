import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppServices } from '../../services/app.services';
import { Chart } from 'chart.js';

/**
 * Generated class for the AssignResultPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-assign-result',
  templateUrl: 'assign-result.html',
})
export class AssignResultPage {
  @ViewChild('surveyCanvas') surveyCanvas;

  public today = new Date();
  public surveyToday = new Date();

  public assignResult = [];
  public totalResult = {fin:0, unfin:0, ratio:0, finDate:0, unfinDate:0, dateRatio:0};
  public monthResult = {fin:0, unfin:0, ratio:0, finDate:0, unfinDate:0, dateRatio:0};
  public surveyChart: any = undefined;

  public chartConfig = {
    type: 'line',
    data: {
      labels: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
      datasets: [],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        yAxes: [{
          ticks: {
            suggestedMin:0,
            suggestedMax:50,
            beginAtZero: true,
          }
        }],
        xAxes: [{
          type: 'time',
          time: {
            min: new Date(this.surveyToday.getFullYear(), 0),
            max: new Date(this.surveyToday.getFullYear(), 12),
            displayFormats: {
              month: 'M월'
            },
            unit: 'month',
            stepSize:1,
          }
        }]
      },
      elements: {
        line: {
          tension: 0,
        }
      },
    }
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public serv: AppServices,
  ) {}

  ionViewDidLoad() {
    this.getAssignResult();
    this.getSurveyResult();
    // this.getAssignResult();
  }

  ionViewDidEnter() {
    this.getAssignResult();
    this.getSurveyResult();
  }

  ionViewDidLeave() {}

  public getAssignResult() {
    this.serv.getAssignResult()
    .then(data =>{
      this.assignResult = data;
      this.totalResult = this.genResultObj(data);
      this.monthResult = this.genMonthObj(data);
    })
    .catch(obj=>{ this.serv.msgServ(obj) })
  }

  public getSurveyResult() {
    this.serv.getSurveyResult(this.surveyToday.getUTCFullYear())
    .then(data =>{
      this.makeChart(this.getSurveyObj(data));
      // this.surveyCanvas.data.datasets = this.getSurveyObj(data)
    })
    .catch(obj=>{ this.serv.msgServ(obj); })
  }


  public genResultObj(data) {
    if(data.length !== 0) {
      let total = data.reduce((prev, cu)=>{
        prev.fin += cu.date_fin
        prev.unfin += cu.date_unfin
        if(cu.date_unfin === 0 && cu.date_fin > 0) {
          prev.finDate ++;
        } else if(cu.date_unfin > 0) {
          prev.unfinDate ++;
        }
        return prev
      }, {fin:0, unfin:0, finDate:0, unfinDate:0})
      return {
        fin: total.fin,
        unfin: total.unfin,
        ratio: total.fin/(total.fin+total.unfin)*100,
        finDate: total.finDate,
        unfinDate: total.unfinDate,
        dateRatio: total.finDate/(total.finDate+total.unfinDate)*100,
      }
    } else {
      return {fin:0, unfin:0, ratio:0, finDate:0, unfinDate:0, dateRatio:0};
    }
  }

  public genMonthObj(data, date?:Date) {
    let tgtMonth = date ? date : this.today;
    let filteredData = data.filter(obj=>{
      return obj.date.split('-')[1] == tgtMonth.getUTCMonth() + 1 &&
             obj.date.split('-')[0] == tgtMonth.getUTCFullYear();
    })
    console.log(filteredData);
    return this.genResultObj(filteredData);
  }

  public prevMonth() {
    this.today = new Date(this.today.getFullYear(), this.today.getMonth(), -1)
    this.monthResult = this.genMonthObj(this.assignResult);
  }

  public nextMonth() {
    this.today = new Date(this.today.getFullYear(), this.today.getMonth(), 33)
    this.monthResult = this.genMonthObj(this.assignResult);
  }

  public prevSurveyMonth() {
    this.surveyToday = new Date(this.surveyToday.getFullYear(), 0, -1)
    this.getSurveyResult()
  }

  public nextSurveyMonth() {
    this.surveyToday = new Date(this.surveyToday.getFullYear(), 11, 33)
    this.getSurveyResult()
  }

  public getSurveyObj(surveyResult) {
    surveyResult.sort((a, b)=>{
      return a.idSURVEY > b.idSURVEY ? -1 : a.idSURVEY === b.idSURVEY ? 0 : 1;
    })
    let surveyArray = surveyResult.reduce((prev, cu)=>{
      let lastArray = prev[prev.length-1];
      if(prev.length === 0 || cu.idSURVEY !== lastArray[lastArray.length-1].idSURVEY) {
        prev.push([cu])
      } else {
        lastArray.push(cu)
      }
      return prev
    }, [])

    return surveyArray.map((obj, idx) => {
      let colorPool = ['#45ad70', '#c77ffa', '#2396cf', '#c9410f', '#1d5086'];
      obj.sort((a, b) =>{
        return a.PUSH_TIME > b.PUSH_TIME ? -1 : a.PUSH_TIME === b.PUSH_TIME ? 0 : 1;
      });
      return {
          label: obj[0].title,
          data: obj.map(oobj=>{ return {t:new Date(oobj.PUSH_TIME), y:oobj.POINT}}),
          fill: false,
          borderColor: colorPool[idx%colorPool.length],
          backgroundColor: colorPool[idx%colorPool.length],
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointHoverBackgroundColor: colorPool[idx%colorPool.length],
      }
    })
  }

  public makeChart(surveyObj) {
    this.chartConfig.data.datasets = surveyObj;
    this.chartConfig.options.scales.xAxes[0].time.min = new Date(this.surveyToday.getFullYear(), 0);
    this.chartConfig.options.scales.xAxes[0].time.max = new Date(this.surveyToday.getFullYear(), 12);
    if(!this.surveyChart) {
      this.surveyChart = new Chart(this.surveyCanvas.nativeElement, this.chartConfig)
    }
    this.surveyChart.update();
    // this.surveyCanvas.update()
  }
}
