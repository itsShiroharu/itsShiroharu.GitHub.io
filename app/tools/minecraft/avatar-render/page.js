import Header from '/app/header.js';
import Footer from '/app/footer.js';

const contentHtml = `
<div class="tool-content-stack">
  <section id="shr_simple">
    <h2>2D Avatar (Simple)</h2>
    <p class="lead">Returns a 2D front-facing avatar head. You can use either a Minecraft username or UUID.</p>
    <pre><code class="html">https://{yourName}.vercel.app/avatar/{username_or_uuid}/{size}.png</code></pre>
    <img style="max-width: 100%; max-height: 128px;" src="https://shiroharu.eu.org/images/idc-avatar.png" alt="avatar render" />
  </section>

  <div class="tool-divider"></div>

  <section id="shr_isometric">
    <h2>3D Avatar (Isometric)</h2>
    <p class="lead">Returns a 3D isometric view of the player's head. You can use either a Minecraft username or UUID.</p>
    <pre><code class="html">https://{yourName}.vercel.app/cube/{username_or_uuid}/{size}.png</code></pre>
    <img style="max-width: 100%; max-height: 128px;" src="https://shiroharu.eu.org/images/idc-cube.png" alt="cube render" />
  </section>

  <div class="tool-divider"></div>

  <section id="shr_body">
    <h2>Full Body</h2>
    <p class="lead">Returns a full-body render (head, torso, arms, legs) of the player's skin. You can use either a Minecraft username or UUID.</p>
    <pre><code class="html">https://{yourName}.vercel.app/body/{username_or_uuid}/{size}.png</code></pre>
    <img style="max-width: 100%; max-height: 128px;" src="https://shiroharu.eu.org/images/idc-body.png" alt="body render" />
  </section>

  <div class="tool-divider"></div>

  <section id="shr_bust">
    <h2>Bust Body</h2>
    <p class="lead">Returns a bust render (head, torso, arms) of the player's skin. You can use either a Minecraft username or UUID.</p>
    <pre><code class="html">https://{yourName}.vercel.app/bust/{username_or_uuid}/{size}.png</code></pre>
    <img style="max-width: 100%; max-height: 128px;" src="https://shiroharu.eu.org/images/idc-bust.png" alt="bust render" />
  </section>

  <div class="tool-divider"></div>

  <section id="shr_skin">
    <h2>Player Skin</h2>
    <p class="lead">Returns the raw Minecraft skin texture of any registered players.</p>
    <pre><code class="html">https://{yourName}.vercel.app/skin/{username_or_uuid}</code></pre>
    <img style="max-width: 100%; max-height: 128px;" src="https://shiroharu.eu.org/images/idc-skin.png" alt="skin render" />
  </section>

  <div class="tool-divider"></div>

  <section id="shr_api">
    <h2>API Endpoints</h2>
    <p class="lead">Below is the list of API endpoints used by this project:</p>
    <ol>
      <li>2D Avatar (Simple)</li>
      <pre><code class="javascript">GET /avatar/{username_or_uuid}/{size}.png
GET /avatar/{username_or_uuid} // Defaults to 512px</code></pre>
      <li>3D Avatar (Isometric)</li>
      <pre><code class="javascript">GET /cube/{username_or_uuid}/{size}.png
GET /cube/{username_or_uuid} // Defaults to 512px</code></pre>
      <li>Full Body</li>
      <pre><code class="javascript">GET /body/{username_or_uuid}/{size}.png
GET /body/{username_or_uuid} // Defaults to 512px</code></pre>
      <li>Bust Body</li>
      <pre><code class="javascript">GET /bust/{username_or_uuid}/{size}.png
GET /bust/{username_or_uuid} // Defaults to 512px</code></pre>
      <li>Player Skin</li>
      <pre><code class="javascript">GET /skin/{username_or_uuid}
// Defaults to 64px because of how Minecraft Skin Works</code></pre>
    </ol>
    <p class="lead">If the size is not specified on the API, it will default to 512px.</p>
  </section>

  <div class="tool-divider"></div>

  <section id="shr_apir">
    <h2>API References</h2>
    <div style="width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch;">
      <table>
        <tr><th>Method</th><th>Parameters</th><th>Returns</th><th>Description</th></tr>
        <tr><td><code>renderAvatar(username, size?)</code></td><td>username: string, size: number</td><td>Promise&lt;Buffer&gt;</td><td>Render 2D avatar head</td></tr>
        <tr><td><code>renderCube(username, size?)</code></td><td>username: string, size: number</td><td>Promise&lt;Buffer&gt;</td><td>Render 3D isometric head</td></tr>
        <tr><td><code>renderBody(username, size?)</code></td><td>username: string, size: number</td><td>Promise&lt;Buffer&gt;</td><td>Render full body</td></tr>
        <tr><td><code>renderBust(username, size?)</code></td><td>username: string, size: number</td><td>Promise&lt;Buffer&gt;</td><td>Render half body</td></tr>
        <tr><td><code>getSkin(username)</code></td><td>username: string</td><td>Promise&lt;Buffer&gt;</td><td>Get raw skin texture</td></tr>
        <tr><td><code>render(type, username, size?)</code></td><td>type: string, username: string, size: number</td><td>Promise&lt;Buffer&gt;</td><td>Universal render method</td></tr>
        <tr><td><code>resolveUUID(username)</code></td><td>username: string</td><td>Promise&lt;string&gt;</td><td>Convert username to UUID</td></tr>
        <tr><td><code>getSkinURL(uuid)</code></td><td>uuid: string</td><td>Promise&lt;string&gt;</td><td>Get skin texture URL</td></tr>
      </table>
    </div>
  </section>

  <div class="tool-divider"></div>

  <section id="shr_cli">
    <h2>CLI</h2>
    <p class="lead">You can render avatar, cube, full body, bust, and skin using the CLI.</p>
    <ol>Here's how to do it:
      <li>Download this repository</li>
      <li>Ensure Node.js is already installed on v22 or above</li>
      <li>Extract and open the repository folder</li>
      <li>Open a terminal and run the following commands</li>
    </ol>
    <pre><code class="html">npm install
npm link
npm run cli</code></pre>
    <p class="lead">To use the CLI, these are the commands available</p>
    <pre><code class="html">== Long form ==
identicraft cube YOUR_USERNAME -output ANY_FILENAME_YOU_WANT.png

== Short form ==
idc cube YOUR_USERNAME -o ANY_FILENAME_YOU_WANT.png

== With custom size ==
idc avatar itsShiroharu -o shiroharu_face.png -s 256

== Full body render ==
idc body itsShiroharu -o shiroharu_body.png

== Get raw skin ==
idc skin itsShiroharu -o shiroharu_skin.png</code></pre>
    <div style="width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch;">
      <table>
        <tr><th>Flag</th><th>Long Form</th><th>Description</th></tr>
        <tr><td><code>-o</code></td><td><code>--output [file]</code></td><td>Output file path (default: output.png)</td></tr>
        <tr><td><code>-s</code></td><td><code>--size [size]</code></td><td>Size in pixels 8-512 (default: 512)</td></tr>
        <tr><td><code>-h</code></td><td><code>--help</code></td><td>Display help</td></tr>
        <tr><td><code>-V</code></td><td><code>--version</code></td><td>Display version</td></tr>
      </table>
    </div>
    <div style="width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch;">
      <table>
        <tr><th>Render Types</th><th>Description</th></tr>
        <tr><td><code>avatar</code></td><td>2D head (front-facing)</td></tr>
        <tr><td><code>cube</code></td><td>3D isometric head</td></tr>
        <tr><td><code>body</code></td><td>Full body render</td></tr>
        <tr><td><code>bust</code></td><td>Half body (torso + head)</td></tr>
        <tr><td><code>skin</code></td><td>Raw skin texture</td></tr>
      </table>
    </div>
  </section>

  <div class="tool-divider"></div>

  <section id="shr_npm">
    <h2>NPM Package</h2>
    <p class="lead">You can use this package in your project.</p>
    <p>Install in your project:</p>
    <pre><code class="html">npm install identicraft</code></pre>
    <p>ES6 Imports (Recommended):</p>
    <pre><code class="javascript">import Identicraft from 'identicraft';
import { writeFileSync } from 'fs';

// Render avatar
const avatar = await Identicraft.renderAvatar('itsShiroharu', 256);
writeFileSync('shiroharu-avatar.png', avatar);

// Render cube
const cube = await Identicraft.renderCube('itsShiroharu', 128);
writeFileSync('shiroharu-cube.png', cube);

// Render body
const body = await Identicraft.renderBody('itsShiroharu', 256);
writeFileSync('shiroharu-body.png', body);

// Render bust
const bust = await Identicraft.renderBust('itsShiroharu', 128);
writeFileSync('shiroharu-bust.png', bust);

// Get raw skin
const skin = await Identicraft.getSkin('itsShiroharu');
writeFileSync('shiroharu-skin.png', skin);

// Universal render method
const image = await Identicraft.render('cube', 'itsShiroharu', 256);
writeFileSync('shiroharu-cube.png', image);

// Resolve UUID
const uuid = await Identicraft.resolveUUID('itsShiroharu');
console.log(uuid);

// Get skin URL
const skinURL = await Identicraft.getSkinURL(uuid);
console.log(skinURL);</code></pre>
    <p>CommonJS (Require):</p>
    <pre><code class="javascript">const Identicraft = require('identicraft').default;
const { writeFileSync } = require('fs');

(async () => {
  const avatar = await Identicraft.renderAvatar('itsShiroharu', 256);
  writeFileSync('itsShiroharu.png', avatar);
})();</code></pre>
    <p>Named Imports:</p>
    <pre><code class="javascript">import { renderAvatar, renderCube, resolveUUID } from 'identicraft';

const uuid = await resolveUUID('itsShiroharu');
const avatar = await renderAvatar('itsShiroharu', 128);
const cube = await renderCube('itsShiroharu', 256);</code></pre>
  </section>

  <div class="tool-divider"></div>

  <section id="shr_license">
    <h2>License</h2>
    <p>This project is licensed under the MIT License - see the <a href="https://github.com/itsShiroharu/Identicraft/blob/main/LICENSE.md" target="_blank" rel="noreferrer">LICENSE</a> file for details.</p>
    <pre><code class="md">MIT License

Copyright (c) 2025 Shengwei Xiong

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.</code></pre>
  </section>
</div>`;

export default function AvatarRenderPage() {
  return (
    <main className="tool-page">
      <div className="bg-grid" />
      <Header />

      <section className="tool-hero">
        <div className="wrap">
          <div className="eyebrow">Minecraft</div>
          <h1>Identicraft</h1>
          <p className="lede">
            A lightweight Minecraft avatar rendering library, CLI, and serverless API. Open-source and you can try it yourself using your own deployment on Vercel.
          </p>
          <div className="cta-row" style={{ marginTop: '1.25rem' }}>
            <a className="btn btn-primary" href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FitsShiroharu%2FIdenticraft" target="_blank" rel="noopener">
              Deploy to Vercel →
            </a>
            <a className="btn btn-primary" href="https://github.com/itsShiroharu/Identicraft" target="_blank" rel="noopener">
              Source Code →
            </a>
          </div>
        </div>
      </section>

      <section className="wrap tool-card">
        <div className="tool-panel">
          <div className="tool-content-rich" dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
