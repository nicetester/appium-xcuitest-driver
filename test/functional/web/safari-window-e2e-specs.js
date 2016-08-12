import B from 'bluebird';
import _ from 'lodash';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { SAFARI_CAPS } from '../desired';
import { initSession, deleteSession } from '../helpers/session';
import { spinTitleEquals, GUINEA_PIG_PAGE } from './helpers';


chai.should();
chai.use(chaiAsPromised);

describe('safari - windows and frames', function () {
  this.timeout(4 * 60 * 1000);

  let driver;
  before(async () => {
    let caps = _.defaults({
      safariInitialUrl: GUINEA_PIG_PAGE,
      safariAllowPopups: true,
      nativeWebTap: true,
    }, SAFARI_CAPS);
    driver = await initSession(caps);
  });
  after(deleteSession);

  describe('within webview', function () {
    before(async () => {
      // minimize waiting if something goes wrong
      await driver.setImplicitWaitTimeout(1000);
    });

    it('should throw nosuchwindow if there is not one', async () => {
      await driver.window('noexistman').should.eventually.be.rejectedWith(/window could not be found/);
    });

    it('should be able to open and close windows', async () => {
      let el = await driver.elementById('blanklink');
      await el.click();
      await spinTitleEquals(driver, 'I am another page title');

      let handles = await driver.windowHandles();
      await B.delay(2000);
      await driver.close();
      await B.delay(3000);
      (await driver.windowHandles()).length.should.be.below(handles.length);
      await spinTitleEquals(driver, 'I am a page title');
    });

    it('should be able to go back and forward', async () => {
      let link = await driver.elementByLinkText('i am a link');
      await link.click();
      await driver.elementById('only_on_page_2');
      await driver.back();
      await driver.elementById('i_am_a_textbox');
      await driver.forward();
      await driver.elementById('only_on_page_2');
      await driver.back();
    });

    // broken on real devices, see https://github.com/appium/appium/issues/5167
    it('should be able to open js popup windows with safariAllowPopups set to true @skip-real-device', async () => {
      let link = await driver.elementByLinkText('i am a new window link');
      await link.click();
      await spinTitleEquals(driver, 'I am another page title', 30);
    });
  });
});

describe('safari - windows and frames - without safariAllowPopups', function () {
  this.timeout(4 * 60 * 1000);

  let driver;
  before(async () => {
    let caps = _.defaults({
      safariInitialUrl: GUINEA_PIG_PAGE,
      safariAllowPopups: false,
      nativeWebTap: true,
    }, SAFARI_CAPS);
    driver = await initSession(caps);
  });
  after(deleteSession);

  it('should not be able to open js popup windows', async () => {
    await driver.execute("window.open('/test/guinea-pig2.html', null)");
    await spinTitleEquals(driver, 'I am another page title', 5).should.eventually.be.rejected;
  });
});
