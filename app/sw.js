/*
Copyright 2018 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js"
);

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);

  workbox.precaching.precacheAndRoute([]);

  const showNotification = () => {
      if(self.registration.showNotification) {
      self.registration.showNotification('Background sync success!', {
        body: '🎉`🎉`🎉`'
      });
    }
  };

  const queue = new workbox.backgroundSync.Queue('requests');

  const networkWithBackgroundSync = new workbox.strategies.NetworkOnly({
    plugins: [{
      fetchDidFail: async ({request}) => {
        await queue.addRequest(request);
      },
    }],
  });

  workbox.routing.registerRoute(
    /\/api\/add/,
    networkWithBackgroundSync,
    "POST"
  );

  workbox.routing.registerRoute(
    /\/api\/delete/,
    networkWithBackgroundSync,
    "POST"
  );

  self.addEventListener('message', (event) => {
    if (event.data === 'sync') {
      console.log("sync data");
      queue.replayRequests();
    }
  });

} else {
  console.log(`Boo! Workbox didn't load 😬`);
}
