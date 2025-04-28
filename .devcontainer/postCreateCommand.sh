sudo chown -R $USER:$USER .
npm install

npm install -g @nestjs/cli@$(cat node_modules/@nestjs/cli/package.json  | grep version | sed -e 's/[^0-9\.]//g')

export USERTOCREATE="$PGUSER"
export DATABASETOCREATE="$PGDATABASE"
export PASSTOCREATE="$PGPASSWORD"

sudo su postgres <<EOC

export PGUSER=postgres
unset PGPASSWORD
unset PGHOST
unset PGDATABASE

psql -c "CREATE USER $USERTOCREATE WITH PASSWORD '$PASSTOCREATE' SUPERUSER" && 
  createdb --owner=$USERTOCREATE --encoding=UTF8 --template=template0 $DATABASETOCREATE

EOC

