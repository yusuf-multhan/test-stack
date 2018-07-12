import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  exchanges: any[] = [
    {
      name: 'Altex',
      uri: 'https://api.altex.exchange/v1/ticker'
    }, 
    {
      name: 'HitBTC',
      uri: 'https://api.hitbtc.com/api/2/public/ticker'
    },
    {
      name: 'Tradeogre ',
      uri: 'https://tradeogre.com/api/v1/markets'
    }
  ];
  constructor() { }

  ngOnInit() {
  }

}
