import _ from 'lodash';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { SAFARI_CAPS } from '../desired';
import { initSession, deleteSession } from '../helpers/session';
import { GUINEA_PIG_PAGE } from './helpers';


chai.should();
chai.use(chaiAsPromised);

describe('safari - alerts', function () {
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

  it('should accept alert', async () => {
    let el = await driver.elementById('alert1');
    await el.click();
    await driver.acceptAlert();
    (await driver.title()).should.include('I am a page title');
  });

  // it('should dismiss alert', async () => {
  //   let el = await driver.findElement('id', 'alert1');
  //   await driver.click(el);
  //   await driver.postDismissAlert();
  //   (await driver.title()).should.include('I am a page title');
  // });
  //
  // it('should get text of alert', async () => {
  //   let el = await driver.findElement('id', 'alert1');
  //   await driver.click(el);
  //   (await driver.getAlertText()).should.include('I am an alert');
  //   await driver.postDismissAlert();
  // });
  //
  // it('should not get text of alert that closed', async () => {
  //   let el = await driver.findElement('id', 'alert1');
  //   await driver.click(el);
  //   await driver.postAcceptAlert();
  //   return driver.getAlertText()
  //     .should.be.rejectedWith(/An attempt was made to operate on a modal dialog when one was not open/);
  // });
  //
  // it('should set text of prompt', async () => {
  //   let el = await driver.findElement('id', 'prompt1');
  //   await driver.click(el);
  //   await driver.setAlertText('yes I do!');
  //   await driver.postAcceptAlert();
  //
  //   el = await driver.findElement('id', 'promptVal');
  //   // TODO: avoiding flaky test case where value is 'yes I dO'.
  //   (await driver.getAttribute('value', el)).toLowerCase().should.equal('yes i do!');
  // });
  //
  // it('should fail to set text of alert', async () => {
  //   let el = await driver.findElement('id', 'alert1');
  //   await driver.click(el);
  //   return driver.setAlertText('yes I do!')
  //     .should.be.rejectedWith(/Tried to set text of an alert that wasn't a prompt/);
  // });
});
