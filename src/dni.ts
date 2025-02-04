// noinspection JSSuspiciousNameCombination

import {HtmlElementWrapper} from './common/html_element_wrapper';
import {SVG_ID} from './constants';

/**
 * Ok, DNI is the do not interest button
 */
export class DNI extends HtmlElementWrapper {
  marginTop = 0

  constructor(marginTop = 0) {
    super(null)
    this.marginTop = marginTop
    this.ele = this._createDniButton()
  }

  // it's something not interesting??
  _createDniButton() {
    let button = document.createElement('button');
    button.setAttribute('class', 'style-scope yt-icon-button ytd-menu-renderer')
    button.setAttribute('style', `margin-top: ${this.marginTop}px`)

    let svg = this._createSvg()
    svg.setAttribute('id', SVG_ID)
    button.appendChild(svg)
    return button
  }

  // 创建svg。即那个圆圈中加一杠图案
  _createSvg() {
    function getNode(n, v) {
      n = document.createElementNS('http://www.w3.org/2000/svg', n);
      for (let p in v)
        n.setAttributeNS(null, p.replace(/[A-Z]/g, function (m, p, o, s) {
          return '-' + m.toLowerCase();
        }), v[p]);
      return n
    }

    let width = 24
    let height = width

    let svg = getNode('svg', {width: width, height: height});
    let padding = 2
    svg.setAttribute('viewBox', `-${padding} -${padding} ${width + padding * 2} ${height + padding * 2}`)
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')
    document.body.insertBefore(svg, document.body.firstChild);


    let g = getNode('g', {class: ''});
    svg.appendChild(g)

    let path1 = getNode('path', {d: 'M0 0h24v24H0z', fill: 'none', class: 'style-scope yt-icon'})
    let path2 = getNode('path', {
      d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z',
      class: 'style-scope yt-icon'
    })
    g.appendChild(path1)
    g.appendChild(path2)
    return svg
  }
}
