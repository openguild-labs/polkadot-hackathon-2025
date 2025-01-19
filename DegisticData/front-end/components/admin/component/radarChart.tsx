import React, { PureComponent } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const data = [
  {
    subject: 'Order Accuracy',
    A: 120,
    B: 110,
    fullMark: 150,
  },
  {
    subject: 'Delivery Rate',
    A: 98,
    B: 130,
    fullMark: 150,
  },
  {
    subject: 'On-Time Delivery',
    A: 86,
    B: 130,
    fullMark: 150,
  },
  {
    subject: 'Average Time/Delivery',
    A: 99,
    B: 100,
    fullMark: 150,
  },
  {
    subject: 'Average Cost/Delivery',
    A: 85,
    B: 90,
    fullMark: 150,
  },
  {
    subject: 'Net Promoter Score (NPS)',
    A: 65,
    B: 85,
    fullMark: 150,
  },
];

export default class RadarChartAdmin extends PureComponent {
  static demoUrl = 'https://codesandbox.io/p/sandbox/simple-radar-chart-2p5sxm';

  render() {
    return (
      <ResponsiveContainer className="w-[80%] flex justify-center">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" className='text-xs' />
          <PolarRadiusAxis />
          <Radar name="Mike" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        </RadarChart>
      </ResponsiveContainer>
    );
  }
}