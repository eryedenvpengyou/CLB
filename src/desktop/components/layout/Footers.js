import React, { Component } from 'react';
import * as styles from '../../styles/footer.css'


class Footers extends Component {

    render() {
        let footerdate =new Date().getFullYear();
        return (
            <div>
                <footer style={{ textAlign: 'center' }}>
                    <div style={{textAlign: 'center'}} id="test">
                        <a className={styles.footer} href="#" rel="nofollow" >联系我们</a>|<a  className={styles.footer} href="#" rel="nofollow"  >加入我们</a>|<a  className={styles.footer} href="#" rel="nofollow"  >免责申明</a>|<a  className={styles.footer} href="#" rel="nofollow"  >意见反馈</a>|<a  className={styles.footer} href="#" rel="nofollow"  >友情链接</a><br />
                        <div style={{margin: 5 }} ><font>Copyright &copy; </font><span>{footerdate}</span> <font>FORTUNE FEDERATION . All Rights Reserved </font></div>
                    </div>
                </footer>
            </div>
        );
    }
}

export default Footers;
