import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod, XHRBackend, RequestOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import {Todo} from '../../app/todo/todo';

export function mockBackEndFactory(backend: MockBackend, options: BaseRequestOptions, realBackend: XHRBackend) {
        // configure fake backend
        let todos: Todo[] = JSON.parse(localStorage.getItem('todos')) || [];
        let lastId: number = parseInt(localStorage.getItem('lastId')) || 0;

        backend.connections.subscribe((connection: MockConnection) => {
            // wrap in timeout to simulate server api call
            setTimeout(() => {
                // Simulate POST /todos
                if (connection.request.url.endsWith('/api/todos') && connection.request.method === RequestMethod.Post) {
                  // get parameters from post request
                  let params = JSON.parse(connection.request.getBody());

                  if (!params.id) {
                    params.id = ++lastId;
                  }
                  todos.push(params);

                  localStorage.setItem('todos', JSON.stringify(todos));
                  localStorage.setItem('lastId', lastId.toString());

                  connection.mockRespond(
                    new Response(
                      new ResponseOptions({
                        status: 200,
                        body: params
                      })
                    )
                  );
                  return;
                }

                // Simulate DELETE /todos/:id
                if (connection.request.url.match(/\/api\/todos\/\d+$/) && connection.request.method === RequestMethod.Delete) {

                  // find the id on the URL
                  let urlParts = connection.request.url.split('/');
                  let id = parseInt(urlParts[urlParts.length - 1]);

                  todos = todos
                    .filter(todo => todo.id !== id);

                  localStorage.setItem('todos', JSON.stringify(todos));

                  connection.mockRespond(
                    new Response(
                      new ResponseOptions({
                        status: 200,
                        body: {}
                      })
                    )
                  );
                  return;
                }

                // Simulate PUT /todos/:id
                if (connection.request.url.match(/\/api\/todos\/\d+$/) && connection.request.method === RequestMethod.Put) {

                  // find the id on the URL
                  let urlParts = connection.request.url.split('/');
                  let id = parseInt(urlParts[urlParts.length - 1]);

                  // get parameters from post request
                  let params = JSON.parse(connection.request.getBody());

                  let todo = todos
                    .filter(todo => todo.id === id)
                    .pop();

                  if (!todo) {
                    connection.mockRespond(
                      new Response(
                        new ResponseOptions({
                          status: 200,
                          body: {error: 'ID not found'}
                        })
                      )
                    );
                  }

                  Object.assign(todo, params.todo);

                  localStorage.setItem('todos', JSON.stringify(todos));

                  connection.mockRespond(
                    new Response(
                      new ResponseOptions({
                        status: 200,
                        body: todo
                      })
                    )
                  );
                  return;
                }

                // Simulate GET /todos
                if (connection.request.url.endsWith('/api/todos') && connection.request.method === RequestMethod.Get) {
                  //console.log("dddd");
                  connection.mockRespond(
                    new Response(
                      new ResponseOptions({
                        status: 200,
                        body: todos
                      })
                    )
                  );
                  return;
                }

                // Simulate GET /todos/:id
                if (connection.request.url.match(/\/api\/todos\/\d+$/) && connection.request.method === RequestMethod.Get) {
                  // find the id on the URL
                  let urlParts = connection.request.url.split('/');
                  let id = parseInt(urlParts[urlParts.length - 1]);

                  let todo = todos
                    .filter(todo => todo.id === id)
                    .pop();

                  connection.mockRespond(
                    new Response(
                      new ResponseOptions({
                        status: 200,
                        body: todo
                      })
                    )
                  );
                  return;
                }

                // Simulate DELETE /todos/clear-completed
                if (connection.request.url.endsWith('/api/todos/clear-completed') && connection.request.method === RequestMethod.Delete) {
                  todos = todos.filter(todo => !todo.complete);
                  localStorage.setItem('todos', JSON.stringify(todos));

                  connection.mockRespond(
                    new Response(
                      new ResponseOptions({
                        status: 200,
                        body: {}
                      })
                    )
                  );
                  return;
                }

                // pass through any requests not handled above
                let realHttp = new Http(realBackend, options);
                let requestOptions = new RequestOptions({
                    method: connection.request.method,
                    headers: connection.request.headers,
                    body: connection.request.getBody(),
                    url: connection.request.url,
                    withCredentials: connection.request.withCredentials,
                    responseType: connection.request.responseType
                });
                realHttp.request(connection.request.url, requestOptions)
                    .subscribe((response: Response) => {
                        connection.mockRespond(response);
                    },
                    (error: any) => {
                        connection.mockError(error);
                    });

            }, 500);

        });
        return new Http(backend, options);
}

export let fakeBackendProvider = {
  provide: Http,
  deps: [MockBackend, BaseRequestOptions, XHRBackend],
  useFactory: mockBackEndFactory
};
